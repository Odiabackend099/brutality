import { appLogger } from './logger'

// Performance metrics storage
interface PerformanceMetrics {
  [key: string]: {
    count: number
    totalTime: number
    averageTime: number
    minTime: number
    maxTime: number
    lastUpdated: Date
  }
}

// System metrics storage
interface SystemMetrics {
  requests: number
  errors: number
  responseTime: number
  memoryUsage: NodeJS.MemoryUsage
  uptime: number
  lastUpdated: Date
}

class MonitoringService {
  private performanceMetrics: PerformanceMetrics = {}
  private systemMetrics: SystemMetrics = {
    requests: 0,
    errors: 0,
    responseTime: 0,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    lastUpdated: new Date()
  }
  private startTime = Date.now()

  // Performance monitoring
  public recordPerformance(operation: string, duration: number, metadata?: any) {
    const key = operation
    
    if (!this.performanceMetrics[key]) {
      this.performanceMetrics[key] = {
        count: 0,
        totalTime: 0,
        averageTime: 0,
        minTime: duration,
        maxTime: duration,
        lastUpdated: new Date()
      }
    }

    const metric = this.performanceMetrics[key]
    metric.count++
    metric.totalTime += duration
    metric.averageTime = metric.totalTime / metric.count
    metric.minTime = Math.min(metric.minTime, duration)
    metric.maxTime = Math.max(metric.maxTime, duration)
    metric.lastUpdated = new Date()

    // Log performance data
    appLogger.logPerformance(operation, duration, metadata)

    // Alert if performance is poor
    if (duration > 5000) { // 5 seconds
      appLogger.warn(`Slow operation detected: ${operation} took ${duration}ms`)
    }
  }

  // Request monitoring
  public recordRequest(method: string, url: string, statusCode: number, responseTime: number) {
    this.systemMetrics.requests++
    this.systemMetrics.responseTime = responseTime
    this.systemMetrics.lastUpdated = new Date()

    // Log request
    appLogger.logAPIRequest({ method, url }, { statusCode }, responseTime)

    // Alert on high error rates
    if (statusCode >= 400) {
      this.systemMetrics.errors++
      appLogger.logAPIError(new Error(`HTTP ${statusCode}: ${method} ${url}`))
    }
  }

  // System health check
  public getSystemHealth() {
    const currentMemory = process.memoryUsage()
    const currentUptime = process.uptime()
    
    // Update system metrics
    this.systemMetrics.memoryUsage = currentMemory
    this.systemMetrics.uptime = currentUptime
    this.systemMetrics.lastUpdated = new Date()

    // Calculate health score (0-100)
    const errorRate = this.systemMetrics.errors / Math.max(this.systemMetrics.requests, 1)
    const memoryUsagePercent = (currentMemory.heapUsed / currentMemory.heapTotal) * 100
    const responseTimeScore = Math.max(0, 100 - (this.systemMetrics.responseTime / 100))
    
    const healthScore = Math.max(0, 100 - (errorRate * 100) - (memoryUsagePercent - 50) - (100 - responseTimeScore))

    return {
      healthScore: Math.round(healthScore),
      metrics: {
        ...this.systemMetrics,
        errorRate: Math.round(errorRate * 100) / 100,
        memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
        uptimeHours: Math.round(currentUptime / 3600 * 100) / 100
      },
      performance: this.performanceMetrics,
      status: healthScore > 80 ? 'healthy' : healthScore > 60 ? 'warning' : 'critical'
    }
  }

  // Get performance metrics
  public getPerformanceMetrics() {
    return this.performanceMetrics
  }

  // Get system metrics
  public getSystemMetrics() {
    return this.systemMetrics
  }

  // Reset metrics
  public resetMetrics() {
    this.performanceMetrics = {}
    this.systemMetrics = {
      requests: 0,
      errors: 0,
      responseTime: 0,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      lastUpdated: new Date()
    }
    this.startTime = Date.now()
    
    appLogger.logSystemEvent('Metrics reset')
  }

  // Alert system
  public checkAlerts() {
    const health = this.getSystemHealth()
    
    if (health.status === 'critical') {
      appLogger.error('System health is critical', { health })
      // Here you would integrate with alerting services like PagerDuty, Slack, etc.
    } else if (health.status === 'warning') {
      appLogger.warn('System health warning', { health })
    }

    // Check for high error rates
    if (health.metrics.errorRate > 0.1) { // 10% error rate
      appLogger.error('High error rate detected', { errorRate: health.metrics.errorRate })
    }

    // Check for high memory usage
    if (health.metrics.memoryUsagePercent > 90) {
      appLogger.error('High memory usage detected', { memoryUsage: health.metrics.memoryUsagePercent })
    }

    // Check for slow response times
    if (health.metrics.responseTime > 5000) { // 5 seconds
      appLogger.warn('Slow response times detected', { responseTime: health.metrics.responseTime })
    }
  }

  // Start monitoring
  public startMonitoring() {
    // Check alerts every minute
    setInterval(() => {
      this.checkAlerts()
    }, 60000)

    // Log system health every 5 minutes
    setInterval(() => {
      const health = this.getSystemHealth()
      appLogger.info('System health check', health)
    }, 300000)

    appLogger.logSystemEvent('Monitoring started')
  }
}

// Singleton instance
export const monitoringService = new MonitoringService()

// Performance decorator for functions
export function monitorPerformance(operationName: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const start = Date.now()
      try {
        const result = await method.apply(this, args)
        const duration = Date.now() - start
        monitoringService.recordPerformance(operationName, duration)
        return result
      } catch (error) {
        const duration = Date.now() - start
        monitoringService.recordPerformance(`${operationName}_error`, duration)
        throw error
      }
    }
  }
}

// Request monitoring middleware
export function requestMonitoring(req: any, res: any, next: any) {
  const start = Date.now()
  
  res.on('finish', () => {
    const duration = Date.now() - start
    monitoringService.recordRequest(req.method, req.url, res.statusCode, duration)
  })
  
  next()
}
