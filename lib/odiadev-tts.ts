// ODIADEV AI TTS - Professional Voice Synthesis
// Powered by ODIADEV AI LTD proprietary technology

// Voice presets mapping to ODIADEV TTS service voices
export const VOICE_PRESETS = {
  professional_f: 'joslyn', // African Female - Warm, Professional
  professional_m: 'marcus', // American Male - Professional, Authoritative
  soft_f: 'marcy', // American Female - Professional, Friendly
  warm_m: 'austyn' // African Male - Strong, Confident
} as const

export type VoiceId = keyof typeof VOICE_PRESETS

interface TTSResponse {
  audioUrl?: string
  audioBuffer?: Buffer
  duration?: number
  error?: string
}

// ODIADEV TTS Service Configuration
const ODIADEV_TTS_BASE_URL = 'https://minimax-tts-odiadev.onrender.com'
const ODIADEV_TTS_ENDPOINT = '/v1/tts'

/**
 * Generate speech from text using ODIADEV AI TTS engine
 * @param text - Text to convert to speech
 * @param voiceId - Voice preset to use
 * @returns Audio data (URL or buffer) with duration
 */
export async function generateTTS(text: string, voiceId: VoiceId): Promise<TTSResponse> {
  const apiKey = process.env.ODIADEV_TTS_API_KEY

  if (!apiKey) {
    throw new Error('ODIADEV TTS API key not configured')
  }

  // Validate text length
  if (text.length > 5000) {
    throw new Error('Text too long. Maximum 5000 characters allowed.')
  }

  try {
    const response = await fetch(`${ODIADEV_TTS_BASE_URL}${ODIADEV_TTS_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        text,
        voice_id: VOICE_PRESETS[voiceId],
        model: 'speech-02-hd',
        speed: 1.0,
        pitch: 0,
        emotion: 'neutral'
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ODIADEV TTS error:', errorText)
      
      // Handle specific error cases
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your ODIADEV TTS credentials.')
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.')
      } else if (response.status === 400) {
        throw new Error('Invalid request. Please check your text and voice settings.')
      }
      
      throw new Error(`TTS API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    // Handle different response formats
    if (data.audio_url) {
      return {
        audioUrl: data.audio_url,
        duration: data.duration
      }
    } else if (data.audio_file) {
      return {
        audioUrl: data.audio_file,
        duration: data.duration
      }
    } else if (data.audio) {
      // Base64 audio - convert to buffer
      const audioBuffer = Buffer.from(data.audio, 'base64')
      return {
        audioBuffer,
        duration: data.duration
      }
    }

    throw new Error('No audio data in TTS response')
  } catch (error) {
    console.error('TTS generation failed:', error)
    return {
      error: error instanceof Error ? error.message : 'TTS generation failed'
    }
  }
}

/**
 * Fallback TTS using browser's built-in speech synthesis
 * This is used when the primary TTS service fails
 * @param text - Text to convert to speech
 * @param voiceId - Voice preset to use
 * @returns Audio data with duration
 */
export async function generateTTSFallback(text: string, voiceId: VoiceId): Promise<TTSResponse> {
  // This is a client-side fallback - would need to be implemented in the frontend
  // For now, return an error indicating fallback is needed
  return {
    error: 'TTS service unavailable. Please try again later or contact support.'
  }
}

/**
 * Health check for ODIADEV TTS service
 * @returns Promise<boolean> - true if service is healthy
 */
export async function checkTTSHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${ODIADEV_TTS_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ODIADEV_TTS_API_KEY}`
      }
    })
    return response.ok
  } catch (error) {
    console.error('TTS health check failed:', error)
    return false
  }
}

/**
 * Get available voices from ODIADEV TTS service
 * @returns Promise<Array> - List of available voices
 */
export async function getAvailableVoices(): Promise<Array<{id: string, name: string, description: string}>> {
  try {
    const response = await fetch(`${ODIADEV_TTS_BASE_URL}/v1/voices/list`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.ODIADEV_TTS_API_KEY}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`)
    }

    const data = await response.json()
    return data.voices || []
  } catch (error) {
    console.error('Failed to fetch voices:', error)
    return []
  }
}

/**
 * Estimate audio duration from text length
 * Based on average speaking rate of ~150 words per minute
 * @param text - Input text
 * @returns Estimated duration in seconds
 */
export function estimateDuration(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil((words / 150) * 60)
}
