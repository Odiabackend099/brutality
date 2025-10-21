import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { monitoringService } from '@/lib/monitoring'
import { appLogger } from '@/lib/logger'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Get system health
    const systemHealth = monitoringService.getSystemHealth()
    
    // Test database connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: dbData, error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    const databaseStatus = dbError ? 'error' : 'healthy'
    const databaseLatency = Date.now() - startTime
    
    // Test external services
    const externalServices = await Promise.allSettled([
      // Test Groq API
      fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }).then(res => ({ service: 'groq', status: res.ok ? 'healthy' : 'error', latency: Date.now() - startTime })),
      
      // Test Deepgram API
      fetch('https://api.deepgram.com/v1/projects', {
        headers: {
          'Authorization': `Token ${process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY}`,
        },
      }).then(res => ({ service: 'deepgram', status: res.ok ? 'healthy' : 'error', latency: Date.now() - startTime })),
    ])
    
    const services = externalServices.map(result => 
      result.status === 'fulfilled' ? result.value : { service: 'unknown', status: 'error', latency: 0 }
    )
    
    // Environment check
    const environment = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      testMode: process.env.TEST_MODE === 'true',
      hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasGroq: !!process.env.GROQ_API_KEY,
      hasDeepgram: !!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY,
      hasFlutterwave: !!process.env.FLUTTERWAVE_PUBLIC_KEY,
    }
    
    // Overall health status
    const allServicesHealthy = services.every(s => s.status === 'healthy') && databaseStatus === 'healthy'
    const overallStatus = allServicesHealthy ? 'healthy' : 'degraded'
    
    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      system: systemHealth,
      database: {
        status: databaseStatus,
        latency: `${databaseLatency}ms`,
        error: dbError?.message || null
      },
      services: services.reduce((acc, service) => {
        acc[service.service] = {
          status: service.status,
          latency: `${service.latency}ms`
        }
        return acc
      }, {} as Record<string, any>),
      checks: {
        database: databaseStatus === 'healthy',
        groq: services.find(s => s.service === 'groq')?.status === 'healthy',
        deepgram: services.find(s => s.service === 'deepgram')?.status === 'healthy',
        memory: systemHealth.metrics.memoryUsagePercent < 90,
        responseTime: systemHealth.metrics.responseTime < 5000,
        errorRate: systemHealth.metrics.errorRate < 0.1
      }
    }
    
    // Log health check
    appLogger.info('Health check completed', healthData)
    
    // Record performance
    const totalLatency = Date.now() - startTime
    monitoringService.recordPerformance('health_check', totalLatency)
    
    return NextResponse.json(healthData, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
    
  } catch (error) {
    const errorData = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime()
    }
    
    appLogger.logAPIError(error as Error, request)
    
    return NextResponse.json(errorData, { status: 500 })
  }
}