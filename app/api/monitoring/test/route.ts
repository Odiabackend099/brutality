import { NextRequest, NextResponse } from 'next/server'
import { monitoringService } from '@/lib/monitoring'
import { appLogger } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Test monitoring system
    const systemHealth = monitoringService.getSystemHealth()
    const performanceMetrics = monitoringService.getPerformanceMetrics()
    
    // Record a test performance metric
    monitoringService.recordPerformance('test_operation', 150)
    
    const testData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      monitoring: {
        systemHealth: {
          status: systemHealth.status,
          healthScore: systemHealth.healthScore
        },
        performanceCount: Object.keys(performanceMetrics).length,
        uptime: process.uptime()
      }
    }
    
    appLogger.info('Monitoring test endpoint accessed', testData)
    
    return NextResponse.json(testData)
    
  } catch (error) {
    appLogger.logAPIError(error as Error, request)
    
    return NextResponse.json(
      { error: 'Monitoring test failed' },
      { status: 500 }
    )
  }
}
