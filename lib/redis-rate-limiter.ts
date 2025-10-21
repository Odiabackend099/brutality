import { createClient } from 'redis'

/**
 * Redis-based rate limiter for distributed deployments
 * Provides tenant isolation and persistent rate limiting across instances
 */
export class RedisRateLimiter {
  private redis: any
  private isConnected: boolean = false

  constructor() {
    this.initializeRedis()
  }

  private async initializeRedis() {
    try {
      // Use Redis URL from environment or fallback to local
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
      
      this.redis = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => Math.min(retries * 50, 500)
        }
      })

      this.redis.on('error', (err: Error) => {
        console.warn('Redis Rate Limiter Error (falling back to no rate limiting):', err.message)
        this.isConnected = false
      })

      this.redis.on('connect', () => {
        console.log('Redis Rate Limiter Connected')
        this.isConnected = true
      })

      // Don't await the connection - let it fail gracefully
      this.redis.connect().catch((error: Error) => {
        console.warn('Redis connection failed (falling back to no rate limiting):', error.message)
        this.isConnected = false
      })
    } catch (error) {
      console.warn('Failed to initialize Redis Rate Limiter (falling back to no rate limiting):', error)
      this.isConnected = false
    }
  }

  /**
   * Check if request is rate limited
   * @param key - Unique identifier for the rate limit (e.g., IP, user ID, tenant ID)
   * @param windowSeconds - Time window in seconds
   * @param maxRequests - Maximum requests allowed in the window
   * @returns Promise<{isLimited: boolean, remaining: number, resetTime: number}>
   */
  async checkRateLimit(
    key: string,
    windowSeconds: number = 60,
    maxRequests: number = 100
  ): Promise<{
    isLimited: boolean
    remaining: number
    resetTime: number
  }> {
    if (!this.isConnected) {
      // Fallback to allow requests if Redis is down
      console.warn('Redis not connected, allowing request (rate limiting disabled)')
      return {
        isLimited: false,
        remaining: maxRequests,
        resetTime: Date.now() + (windowSeconds * 1000)
      }
    }

    try {
      const now = Math.floor(Date.now() / 1000)
      const window = Math.floor(now / windowSeconds)
      const redisKey = `rate_limit:${key}:${window}`
      
      // Get current count
      const currentCount = await this.redis.get(redisKey)
      const count = currentCount ? parseInt(currentCount) : 0
      
      if (count >= maxRequests) {
        return {
          isLimited: true,
          remaining: 0,
          resetTime: (window + 1) * windowSeconds * 1000
        }
      }

      // Increment counter
      await this.redis.incr(redisKey)
      await this.redis.expire(redisKey, windowSeconds * 2) // Keep key for 2 windows

      return {
        isLimited: false,
        remaining: maxRequests - count - 1,
        resetTime: (window + 1) * windowSeconds * 1000
      }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // Allow request if Redis fails
      return {
        isLimited: false,
        remaining: maxRequests,
        resetTime: Date.now() + (windowSeconds * 1000)
      }
    }
  }

  /**
   * Check rate limit for API endpoints
   * @param request - Next.js request object
   * @param maxRequests - Maximum requests per window
   * @param windowSeconds - Time window in seconds
   * @returns Promise<{isLimited: boolean, remaining: number, resetTime: number}>
   */
  async checkAPIRateLimit(
    request: Request,
    maxRequests: number = 50,
    windowSeconds: number = 60
  ): Promise<{
    isLimited: boolean
    remaining: number
    resetTime: number
  }> {
    const key = this.generateAPIKey(request)
    return this.checkRateLimit(key, windowSeconds, maxRequests)
  }

  /**
   * Check rate limit for tenant-specific operations
   * @param tenantId - Tenant identifier
   * @param operation - Operation type (e.g., 'calls', 'api', 'webhook')
   * @param maxRequests - Maximum requests per window
   * @param windowSeconds - Time window in seconds
   * @returns Promise<{isLimited: boolean, remaining: number, resetTime: number}>
   */
  async checkTenantRateLimit(
    tenantId: string,
    operation: string,
    maxRequests: number = 100,
    windowSeconds: number = 60
  ): Promise<{
    isLimited: boolean
    remaining: number
    resetTime: number
  }> {
    const key = `tenant:${tenantId}:${operation}`
    return this.checkRateLimit(key, windowSeconds, maxRequests)
  }

  /**
   * Generate rate limit key for API requests
   */
  private generateAPIKey(request: Request): string {
    const url = new URL(request.url)
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    
    const ip = cfConnectingIP || realIP || (forwarded ? forwarded.split(',')[0] : '') || 'unknown'
    const endpoint = url.pathname
    
    return `api:${ip}:${endpoint}`
  }

  /**
   * Close Redis connection
   */
  async close() {
    if (this.redis && this.isConnected) {
      await this.redis.quit()
      this.isConnected = false
    }
  }
}

// Singleton instance
let rateLimiterInstance: RedisRateLimiter | null = null

/**
 * Get the rate limiter instance
 */
export function getRateLimiter(): RedisRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new RedisRateLimiter()
  }
  return rateLimiterInstance
}

/**
 * Rate limit middleware for API routes
 */
export async function rateLimitMiddleware(
  request: Request,
  options: {
    maxRequests?: number
    windowSeconds?: number
    keyGenerator?: (request: Request) => string
  } = {}
): Promise<{
  allowed: boolean
  remaining: number
  resetTime: number
  error?: string
}> {
  try {
    const rateLimiter = getRateLimiter()
    const maxRequests = options.maxRequests || 50
    const windowSeconds = options.windowSeconds || 60

    let result
    if (options.keyGenerator) {
      const key = options.keyGenerator(request)
      result = await rateLimiter.checkRateLimit(key, windowSeconds, maxRequests)
    } else {
      result = await rateLimiter.checkAPIRateLimit(request, maxRequests, windowSeconds)
    }

    return {
      allowed: !result.isLimited,
      remaining: result.remaining,
      resetTime: result.resetTime,
      error: result.isLimited ? 'Rate limit exceeded' : undefined
    }
  } catch (error) {
    console.error('Rate limit middleware error:', error)
    // Allow request if rate limiting fails
    return {
      allowed: true,
      remaining: options.maxRequests || 50,
      resetTime: Date.now() + ((options.windowSeconds || 60) * 1000)
    }
  }
}
