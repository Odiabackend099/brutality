import crypto from 'crypto'

// Encryption configuration
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const TAG_LENGTH = 16 // 128 bits
const SALT_LENGTH = 32 // 256 bits

// Get encryption key from environment or generate one
function getEncryptionKey(): Buffer {
  const keyString = process.env.ENCRYPTION_KEY
  if (!keyString) {
    throw new Error('ENCRYPTION_KEY environment variable is required')
  }
  
  // If key is hex string, convert to buffer
  if (keyString.length === 64) { // 32 bytes * 2 (hex)
    return Buffer.from(keyString, 'hex')
  }
  
  // Otherwise, derive key from string using PBKDF2
  return crypto.pbkdf2Sync(keyString, 'salt', 100000, KEY_LENGTH, 'sha512')
}

export class EncryptionService {
  private key: Buffer

  constructor() {
    this.key = getEncryptionKey()
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(text: string): string {
    try {
      // Generate random IV and salt
      const iv = crypto.randomBytes(IV_LENGTH)
      const salt = crypto.randomBytes(SALT_LENGTH)
      
      // Derive key from master key and salt
      const derivedKey = crypto.pbkdf2Sync(this.key, salt, 100000, KEY_LENGTH, 'sha512')
      
      // Create cipher
      const cipher = crypto.createCipheriv(ALGORITHM, derivedKey, iv) as crypto.CipherGCM
      cipher.setAAD(salt)
      
      const encryptedBuffer = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
      ])
      
      // Get authentication tag
      const tag = cipher.getAuthTag()
      
      // Combine salt + iv + tag + encrypted data
      const combined = Buffer.concat([salt, iv, tag, encryptedBuffer])
      
      return combined.toString('base64')
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    try {
      // Convert from base64
      const combined = Buffer.from(encryptedData, 'base64')
      
      // Extract components
      const salt = combined.subarray(0, SALT_LENGTH)
      const iv = combined.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
      const tag = combined.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
      const encrypted = combined.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
      
      // Derive key from master key and salt
      const derivedKey = crypto.pbkdf2Sync(this.key, salt, 100000, KEY_LENGTH, 'sha512')
      
      // Create decipher
      const decipher = crypto.createDecipheriv(ALGORITHM, derivedKey, iv) as crypto.DecipherGCM
      decipher.setAAD(salt)
      decipher.setAuthTag(tag)
      
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
   * Hash sensitive data (one-way)
   */
  hash(text: string, salt?: string): string {
    const actualSalt = salt || crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(text, actualSalt, 100000, 64, 'sha512')
    return `${actualSalt}:${hash.toString('hex')}`
  }

  /**
   * Verify hashed data
   */
  verifyHash(text: string, hashedText: string): boolean {
    try {
      const [salt, hash] = hashedText.split(':')
      const newHash = crypto.pbkdf2Sync(text, salt, 100000, 64, 'sha512')
      return newHash.toString('hex') === hash
    } catch (error) {
      console.error('Hash verification error:', error)
      return false
    }
  }

  /**
   * Generate secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Generate secure random password
   */
  generatePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    return password
  }
}

// Singleton instance
export const encryptionService = new EncryptionService()

// Utility functions for common encryption needs
export const encrypt = (text: string) => encryptionService.encrypt(text)
export const decrypt = (encryptedText: string) => encryptionService.decrypt(encryptedText)
export const hashPassword = (password: string) => encryptionService.hash(password)
export const verifyPassword = (password: string, hashedPassword: string) => encryptionService.verifyHash(password, hashedPassword)
export const generateSecureToken = (length?: number) => encryptionService.generateToken(length)
export const generateSecurePassword = (length?: number) => encryptionService.generatePassword(length)
