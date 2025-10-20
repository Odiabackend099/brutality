import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { monitoringService } from '@/lib/monitoring'
import { appLogger } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user is admin (you can implement more sophisticated role checking)
    if (token.email !== 'admin@callwaitingai.com' && process.env.TEST_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    // Get monitoring data
    const systemHealth = monitoringService.getSystemHealth()
    const performanceMetrics = monitoringService.getPerformanceMetrics()
    const systemMetrics = monitoringService.getSystemMetrics()
    
    // Calculate additional metrics
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()
    
    const dashboardData = {
      timestamp: new Date().toISOString(),
      system: {
        status: systemHealth.status,
        healthScore: systemHealth.healthScore,
        uptime: {
          seconds: Math.floor(uptime),
          hours: Math.floor(uptime / 3600),
          days: Math.floor(uptime / 86400)
        },
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100, // MB
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100, // MB
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
        },
        requests: {
          total: systemMetrics.requests,
          errors: systemMetrics.errors,
          errorRate: systemMetrics.requests > 0 ? Math.round((systemMetrics.errors / systemMetrics.requests) * 10000) / 100 : 0
        },
        performance: {
          averageResponseTime: systemMetrics.responseTime,
          status: systemMetrics.responseTime < 1000 ? 'excellent' : 
                  systemMetrics.responseTime < 3000 ? 'good' : 
                  systemMetrics.responseTime < 5000 ? 'fair' : 'poor'
        }
      },
      performance: Object.entries(performanceMetrics).map(([operation, metrics]) => ({
        operation,
        count: metrics.count,
        averageTime: Math.round(metrics.averageTime * 100) / 100,
        minTime: metrics.minTime,
        maxTime: metrics.maxTime,
        totalTime: metrics.totalTime,
        lastUpdated: metrics.lastUpdated
      })),
      alerts: [
        ...(systemHealth.metrics.errorRate > 0.05 ? [{ 
          type: 'error_rate', 
          message: `High error rate: ${Math.round(systemHealth.metrics.errorRate * 100)}%`,
          severity: 'high'
        }] : []),
        ...(systemHealth.metrics.memoryUsagePercent > 80 ? [{ 
          type: 'memory_usage', 
          message: `High memory usage: ${Math.round(systemHealth.metrics.memoryUsagePercent)}%`,
          severity: systemHealth.metrics.memoryUsagePercent > 90 ? 'critical' : 'medium'
        }] : []),
        ...(systemHealth.metrics.responseTime > 3000 ? [{ 
          type: 'response_time', 
          message: `Slow response time: ${Math.round(systemHealth.metrics.responseTime)}ms`,
          severity: systemHealth.metrics.responseTime > 5000 ? 'high' : 'medium'
        }] : [])
      ],
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        environment: process.env.NODE_ENV,
        testMode: process.env.TEST_MODE === 'true'
      }
    }
    
    // Log dashboard access
    appLogger.logUserAction(token.userId as string, 'monitoring_dashboard_access')
    
    return NextResponse.json(dashboardData)
    
  } catch (error) {
    appLogger.logAPIError(error as Error, request)
    
    return NextResponse.json(
      { error: 'Failed to fetch monitoring data' },
      { status: 500 }
    )
  }
}
