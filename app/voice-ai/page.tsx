import VoiceChat from '@/components/VoiceChat';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function VoiceAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Talk to Oma
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have a natural voice conversation with our AI assistant. Click the microphone to start speaking.
            </p>
          </div>
        </div>
      </div>

      {/* Voice Chat Component */}
      <div className="container mx-auto px-4 py-12">
        <VoiceChat />
      </div>

      {/* Instructions */}
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to use:</h3>
          <ol className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex-shrink-0">1</span>
              <span>Click "Start Conversation" to connect</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex-shrink-0">2</span>
              <span>Allow microphone access when prompted</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex-shrink-0">3</span>
              <span>Start speaking naturally - Oma will respond in real-time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium flex-shrink-0">4</span>
              <span>Ask about CallWaitingAI features, pricing, or any questions you have</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
