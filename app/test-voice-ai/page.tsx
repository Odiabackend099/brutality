'use client';

import { useState } from 'react';
import { VADProcessor } from '@/lib/vad-processor';

export default function TestVoiceAI() {
  const [status, setStatus] = useState('Not initialized');
  const [logs, setLogs] = useState<string[]>([]);
  const [vadProcessor, setVADProcessor] = useState<VADProcessor | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const initializeVAD = async () => {
    try {
      addLog('Initializing VAD Processor...');
      const vad = new VADProcessor();
      
      await vad.initialize({
        onSpeechStart: () => {
          addLog('🎤 Speech started');
        },
        onSpeechEnd: (audio) => {
          addLog(`🎤 Speech ended (${audio.length} samples)`);
        },
        onVADMisfire: () => {
          addLog('🎤 VAD misfire');
        },
      });
      
      setVADProcessor(vad);
      setStatus('VAD Initialized Successfully');
      addLog('✅ VAD initialization completed');
    } catch (error) {
      setStatus('VAD Initialization Failed');
      addLog(`❌ VAD initialization failed: ${error}`);
    }
  };

  const startVAD = () => {
    if (vadProcessor) {
      vadProcessor.start();
      setStatus('VAD Started');
      addLog('🎤 VAD started');
    }
  };

  const stopVAD = () => {
    if (vadProcessor) {
      vadProcessor.pause();
      setStatus('VAD Paused');
      addLog('🎤 VAD paused');
    }
  };

  const destroyVAD = () => {
    if (vadProcessor) {
      vadProcessor.destroy();
      setVADProcessor(null);
      setStatus('VAD Destroyed');
      addLog('🎤 VAD destroyed');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Voice AI System Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Control Panel</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Status: <span className="text-white font-medium">{status}</span></p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={initializeVAD}
                  disabled={vadProcessor !== null}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
                >
                  Initialize VAD
                </button>
                
                <button
                  onClick={startVAD}
                  disabled={!vadProcessor}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
                >
                  Start VAD
                </button>
                
                <button
                  onClick={stopVAD}
                  disabled={!vadProcessor}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
                >
                  Stop VAD
                </button>
                
                <button
                  onClick={destroyVAD}
                  disabled={!vadProcessor}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded"
                >
                  Destroy VAD
                </button>
              </div>
              
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                Clear Logs
              </button>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Logs</h2>
            
            <div className="bg-black rounded p-4 h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Environment Info */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Deepgram API Key:</strong> {process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ? '✅ Set' : '❌ Missing'}</p>
              <p><strong>Groq API Key:</strong> {process.env.NEXT_PUBLIC_GROQ_API_KEY ? '✅ Set' : '❌ Missing'}</p>
            </div>
            <div>
              <p><strong>Test Mode:</strong> {process.env.NEXT_PUBLIC_TEST_MODE || 'Not set'}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
