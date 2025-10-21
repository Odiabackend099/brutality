import crypto from 'crypto'

/**
 * Data encryption service for sensitive information
 * Provides AES-256-GCM encryption for sensitive data at rest
 */
export class DataEncryptionService {
  private algorithm = 'aes-256-gcm'
  private keyLength = 32 // 256 bits
  private ivLength = 16 // 128 bits

  private encryptionKey: Buffer

  constructor() {
    try {
      this.encryptionKey = this.getEncryptionKey()
    } catch (error) {
      console.warn('Encryption service disabled:', error)
      // Use a zero-filled key for testing (NOT secure for production)
      this.encryptionKey = Buffer.alloc(this.keyLength, 0)
    }
  }

  /**
   * Get encryption key from environment or generate one
   */
  private getEncryptionKey(): Buffer {
    const keyString = process.env.ENCRYPTION_KEY
    
    if (!keyString) {
      throw new Error(
        'ENCRYPTION_KEY environment variable is required. ' +
        'Generate a 32-byte key using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
      )
    }

    try {
      const keyBuffer = Buffer.from(keyString, 'hex')
      if (keyBuffer.length !== this.keyLength) {
        throw new Error(`ENCRYPTION_KEY must decode to ${this.keyLength} bytes`)
      }
      return keyBuffer
    } catch (error) {
      console.error('Invalid ENCRYPTION_KEY format:', error)
      throw new Error('Invalid ENCRYPTION_KEY format. Must be a 64-character hex string.')
    }
  }

  /**
   * Encrypt sensitive data
   * @param plaintext - Data to encrypt
   * @returns Encrypted data with IV and auth tag
   */
  encrypt(plaintext: string): string {
    if (!plaintext) {
      return plaintext
    }

    try {
      // Generate random IV
      const iv = crypto.randomBytes(this.ivLength)

      const cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv) as crypto.CipherGCM

      const encryptedBuffer = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
      ])
      const authTag = cipher.getAuthTag()

      return [
        iv.toString('hex'),
        authTag.toString('hex'),
        encryptedBuffer.toString('hex')
      ].join(':')
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data
   * @param encryptedData - Data to decrypt
   * @returns Decrypted plaintext
   */
  decrypt(encryptedData: string): string {
    if (!encryptedData || !encryptedData.includes(':')) {
      return encryptedData
    }

    try {
      // Split the combined data
      const parts = encryptedData.split(':')
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format')
      }

      const iv = Buffer.from(parts[0], 'hex')
      const authTag = Buffer.from(parts[1], 'hex')
      const encrypted = Buffer.from(parts[2], 'hex')

      const decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, iv) as crypto.DecipherGCM
      decipher.setAuthTag(authTag)

      const decryptedBuffer = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ])

      return decryptedBuffer.toString('utf8')
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Encrypt object fields selectively
   * @param data - Object to encrypt
   * @param fieldsToEncrypt - Array of field names to encrypt
   * @returns Object with specified fields encrypted
   */
  encryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToEncrypt: (keyof T)[]
  ): T {
    const encrypted = { ...data }

    for (const field of fieldsToEncrypt) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field]) as T[keyof T]
      }
    }

    return encrypted
  }

  /**
   * Decrypt object fields selectively
   * @param data - Object to decrypt
   * @param fieldsToDecrypt - Array of field names to decrypt
   * @returns Object with specified fields decrypted
   */
  decryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToDecrypt: (keyof T)[]
  ): T {
    const decrypted = { ...data }

    for (const field of fieldsToDecrypt) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        decrypted[field] = this.decrypt(decrypted[field]) as T[keyof T]
      }
    }

    return decrypted
  }

  /**
   * Hash sensitive data for search/indexing (one-way)
   * @param data - Data to hash
   * @returns SHA-256 hash
   */
  hashForSearch(data: string): string {
    if (!data) {
      return ''
    }

    return crypto
      .createHash('sha256')
      .update(data + (process.env.ENCRYPTION_SALT || 'callwaiting-ai-salt'))
      .digest('hex')
  }

  /**
   * Generate a secure random token
   * @param length - Token length in bytes
   * @returns Random hex string
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }
}

// Singleton instance
let encryptionServiceInstance: DataEncryptionService | null = null

/**
 * Get the data encryption service instance
 */
export function getDataEncryptionService(): DataEncryptionService {
  if (!encryptionServiceInstance) {
    encryptionServiceInstance = new DataEncryptionService()
  }
  return encryptionServiceInstance
}

/**
 * Utility functions for common encryption tasks
 */
export const DataEncryption = {
  /**
   * Encrypt API keys before storage
   */
  encryptAPIKey: (apiKey: string): string => {
    const service = getDataEncryptionService()
    return service.encrypt(apiKey)
  },

  /**
   * Decrypt API keys for validation
   */
  decryptAPIKey: (encryptedAPIKey: string): string => {
    const service = getDataEncryptionService()
    return service.decrypt(encryptedAPIKey)
  },

  /**
   * Encrypt call transcripts
   */
  encryptTranscript: (transcript: string): string => {
    const service = getDataEncryptionService()
    return service.encrypt(transcript)
  },

  /**
   * Decrypt call transcripts
   */
  decryptTranscript: (encryptedTranscript: string): string => {
    const service = getDataEncryptionService()
    return service.decrypt(encryptedTranscript)
  },

  /**
   * Encrypt lead data
   */
  encryptLeadData: (leadData: Record<string, any>): string => {
    const service = getDataEncryptionService()
    return service.encrypt(JSON.stringify(leadData))
  },

  /**
   * Decrypt lead data
   */
  decryptLeadData: (encryptedLeadData: string): Record<string, any> => {
    const service = getDataEncryptionService()
    const decrypted = service.decrypt(encryptedLeadData)
    return JSON.parse(decrypted)
  },

  /**
   * Create searchable hash for sensitive data
   */
  createSearchHash: (data: string): string => {
    const service = getDataEncryptionService()
    return service.hashForSearch(data)
  }
}

/**
 * Database field encryption helpers
 */
export const EncryptedFields = {
  AGENTS: ['api_key_hash', 'webhook_secret'] as const,
  CALL_LOGS: ['transcript', 'lead_data'] as const,
  PROFILES: ['phone_number', 'email'] as const,
  CONVERSATION_MESSAGES: ['content'] as const
} as const

/**
 * Middleware to automatically encrypt/decrypt database fields
 */
export function withEncryption<T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: readonly (keyof T)[],
  operation: 'encrypt' | 'decrypt'
): T {
  const service = getDataEncryptionService()
  
  if (operation === 'encrypt') {
    return service.encryptFields(data, fieldsToEncrypt as (keyof T)[])
  } else {
    return service.decryptFields(data, fieldsToEncrypt as (keyof T)[])
  }
}
