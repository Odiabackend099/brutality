import { createClient } from '@deepgram/sdk';

export class DeepgramSTT {
  private dg: any;

  constructor() {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      console.warn('DEEPGRAM_API_KEY environment variable is not set');
      this.dg = null;
    } else {
      this.dg = createClient(apiKey);
    }
  }

  async transcribeMulaw8k(buffer: Buffer): Promise<string> {
    if (!this.dg) {
      throw new Error('Deepgram client not initialized - check DEEPGRAM_API_KEY');
    }
    
    try {
      const res = await this.dg.listen.prerecorded.transcribeFile(
        buffer,
        { 
          model: 'nova-2', 
          smart_format: true, 
          punctuate: true, 
          language: 'en',
          interim_results: false
        }
      );
      
      return res?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || '';
    } catch (error) {
      console.error('Deepgram transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async transcribeWav(buffer: Buffer): Promise<string> {
    if (!this.dg) {
      throw new Error('Deepgram client not initialized - check DEEPGRAM_API_KEY');
    }
    
    try {
      const res = await this.dg.listen.prerecorded.transcribeFile(
        buffer,
        { 
          model: 'nova-2', 
          smart_format: true, 
          punctuate: true, 
          language: 'en',
          interim_results: false
        }
      );
      
      return res?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || '';
    } catch (error) {
      console.error('Deepgram transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }
}
