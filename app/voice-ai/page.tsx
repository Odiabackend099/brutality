import StreamingVoiceChat from '@/components/StreamingVoiceChat';

export default function VoiceAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Voice Assistant
          </h1>
          <p className="text-xl text-gray-300">
            Continuous streaming voice chat with ultra-low latency
          </p>
        </div>
        
        <StreamingVoiceChat 
          className="max-w-4xl mx-auto"
          config={{
            enableInterruption: true,
            preBufferResponses: true,
            maxLatency: 500,
            bufferSize: 4096,
            chunkSize: 1024,
            overlapSize: 512
          }}
        />
      </div>
    </div>
  );
}
