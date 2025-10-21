import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { encryptionService } from './encryption'
import { getRateLimiter } from './redis-rate-limiter'

// Security configuration
const SECURITY_CONFIG = {
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
  API_RATE_LIMIT_MAX_REQUESTS: 50,
  SUSPICIOUS_PATTERNS: [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /<script/i,
    /<\/script/i,
    /union.*select/i,
    /drop.*table/i,
    /delete.*from/i,
    /insert.*into/i,
    /update.*set/i
  ],
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://callwaitingai.com',
    'https://www.callwaitingai.com',
    'https://callwaitingai.vercel.app'
  ]
}

export interface SecurityOptions {
  requireAuth?: boolean
  rateLimit?: boolean
  maxRequests?: number
  allowedMethods?: string[]
  validateInput?: boolean
  encryptResponse?: boolean
}

export class APISecurityManager {
  private options: SecurityOptions

  constructor(options: SecurityOptions = {}) {
    this.options = {
      requireAuth: true,
      rateLimit: true,
      maxRequests: SECURITY_CONFIG.API_RATE_LIMIT_MAX_REQUESTS,
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      validateInput: true,
      encryptResponse: false,
      ...options
    }
  }

  /**
   * Check if request is rate limited using Redis
   */
  private async isRateLimited(request: NextRequest): Promise<boolean> {
    if (!this.options.rateLimit) return false

    // Temporarily disable Redis rate limiting for testing
    return false
    
    try {
      const rateLimiter = getRateLimiter()
      const maxRequests = this.options.maxRequests || SECURITY_CONFIG.API_RATE_LIMIT_MAX_REQUESTS
      
      const result = await rateLimiter.checkAPIRateLimit(request, maxRequests, 60)
      return result.isLimited
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Allow request if rate limiting fails
      return false
    }
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfConnectingIP = request.headers.get('cf-connecting-ip')
    
    return cfConnectingIP || realIP || (forwarded ? forwarded.split(',')[0] : '') || request.ip || 'unknown'
  }

  /**
   * Validate request origin
   */
  private validateOrigin(request: NextRequest): boolean {
    // For development and testing, allow localhost
    if (process.env.NODE_ENV === 'development' || process.env.TEST_MODE === 'true') {
      return true
    }
    
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    if (!origin && !referer) return true // Allow requests without origin/referer
    
    const allowedOrigins = SECURITY_CONFIG.ALLOWED_ORIGINS
    
    if (origin && allowedOrigins.includes(origin)) return true
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        const refererOrigin = refererUrl.origin
        if (allowedOrigins.includes(refererOrigin)) return true
      } catch (error) {
        // Invalid referer URL
      }
    }
    
    return false
  }

  /**
   * Validate request method
   */
  private validateMethod(request: NextRequest): boolean {
    if (!this.options.allowedMethods) return true
    
    return this.options.allowedMethods.includes(request.method)
  }

  /**
   * Sanitize input data
   */
  private sanitizeInput(data: any): any {
    if (typeof data === 'string') {
      // Check for suspicious patterns
      for (const pattern of SECURITY_CONFIG.SUSPICIOUS_PATTERNS) {
        if (pattern.test(data)) {
          throw new Error('Invalid input detected')
        }
      }
      
      // Basic XSS protection
      return data
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeInput(item))
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value)
      }
      return sanitized
    }
    
    return data
  }

  /**
   * Validate and sanitize request body
   */
  private async validateRequestBody(request: NextRequest): Promise<any> {
    if (!this.options.validateInput) return null

    try {
      const contentType = request.headers.get('content-type')
      
      if (contentType?.includes('application/json')) {
        const body = await request.json()
        return this.sanitizeInput(body)
      }
      
      if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData()
        const body: any = {}
        for (const [key, value] of formData.entries()) {
          body[key] = value
        }
        return this.sanitizeInput(body)
      }
      
      return null
    } catch (error) {
      throw new Error('Invalid request body')
    }
  }

  /**
   * Check authentication
   */
  private async checkAuthentication(request: NextRequest): Promise<any> {
    if (!this.options.requireAuth) return null

    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      throw new Error('Authentication required')
    }
    
    return token
  }

  /**
   * Create secure response
   */
  private createSecureResponse(data: any, status: number = 200): NextResponse {
    let responseData = data
    
    // Encrypt response if required
    if (this.options.encryptResponse && typeof data === 'string') {
      responseData = encryptionService.encrypt(data)
    }
    
    const response = NextResponse.json(responseData, { status })
    
    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    
    return response
  }

  /**
   * Main security middleware
   */
  async secureRequest(
    request: NextRequest,
    handler: (request: NextRequest, token?: any, body?: any) => Promise<any>
  ): Promise<NextResponse> {
    try {
      // Validate origin
      if (!this.validateOrigin(request)) {
        return this.createSecureResponse(
          { error: 'Access denied' }, 
          403
        )
      }

      // Validate method
      if (!this.validateMethod(request)) {
        return this.createSecureResponse(
          { error: 'Method not allowed' }, 
          405
        )
      }

      // Check rate limiting
      if (await this.isRateLimited(request)) {
        return this.createSecureResponse(
          { error: 'Rate limit exceeded' }, 
          429
        )
      }

      // Check authentication
      const token = await this.checkAuthentication(request)

      // Validate and sanitize request body
      const body = await this.validateRequestBody(request)

      // Execute handler
      const result = await handler(request, token, body)

      // Return secure response
      return this.createSecureResponse(result)

    } catch (error) {
      console.error('Security middleware error:', error)
      
      const errorMessage = error instanceof Error ? error.message : 'Internal server error'
      const statusCode = errorMessage.includes('Authentication') ? 401 : 500
      
      return this.createSecureResponse(
        { error: errorMessage }, 
        statusCode
      )
    }
  }
}

// Utility function for creating secure API handlers
export function createSecureAPIHandler(
  handler: (request: NextRequest, token?: any, body?: any) => Promise<any>,
  options?: SecurityOptions
) {
  const securityManager = new APISecurityManager(options)
  
  return async (request: NextRequest) => {
    return securityManager.secureRequest(request, handler)
  }
}

// Pre-configured security managers for common use cases
export const publicAPI = new APISecurityManager({
  requireAuth: false,
  rateLimit: true,
  maxRequests: 100
})

export const authenticatedAPI = new APISecurityManager({
  requireAuth: true,
  rateLimit: true,
  maxRequests: 50
})

export const adminAPI = new APISecurityManager({
  requireAuth: true,
  rateLimit: true,
  maxRequests: 20,
  validateInput: true
})

export const highSecurityAPI = new APISecurityManager({
  requireAuth: true,
  rateLimit: true,
  maxRequests: 10,
  validateInput: true,
  encryptResponse: true
})
