// ODIADEV AI TTS - Professional Voice Synthesis
// Powered by ODIADEV AI LTD proprietary technology

export const VOICE_PRESETS = {
  professional_f: 'female-professional-en',
  professional_m: 'male-professional-en',
  soft_f: 'female-soft-en',
  warm_m: 'male-warm-en'
} as const

export type VoiceId = keyof typeof VOICE_PRESETS

interface TTSResponse {
  audioUrl?: string
  audioBuffer?: Buffer
  duration?: number
  error?: string
}

/**
 * Generate speech from text using ODIADEV AI TTS engine
 * @param text - Text to convert to speech
 * @param voiceId - Voice preset to use
 * @returns Audio data (URL or buffer) with duration
 */
export async function generateTTS(text: string, voiceId: VoiceId): Promise<TTSResponse> {
  const apiKey = process.env.ODIADEV_TTS_API_KEY
  const groupId = process.env.ODIADEV_TTS_GROUP_ID

  if (!apiKey || !groupId) {
    throw new Error('ODIADEV TTS API credentials not configured')
  }

  try {
    const response = await fetch('https://api.minimax.chat/v1/t2a_v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'speech-01',
        text,
        voice_id: VOICE_PRESETS[voiceId],
        audio_setting: {
          sample_rate: 24000,
          bitrate: 128000,
          format: 'mp3'
        },
        group_id: groupId
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('ODIADEV TTS error:', error)
      throw new Error(`TTS API error: ${response.status}`)
    }

    const data = await response.json()

    // Return audio as URL or buffer
    if (data.audio_file) {
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
 * Estimate audio duration from text length
 * Based on average speaking rate of ~150 words per minute
 * @param text - Input text
 * @returns Estimated duration in seconds
 */
export function estimateDuration(text: string): number {
  const words = text.split(/\s+/).length
  return Math.ceil((words / 150) * 60)
}
