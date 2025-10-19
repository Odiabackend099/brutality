'use client';

import { useState } from 'react';
import { GroqLLM } from '@/lib/groq-llm';

export default function TestVoiceAIPage() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testGroqLLM = async () => {
    setIsLoading(true);
    setTestResult('Testing Groq LLM...');
    
    try {
      const groqLLM = new GroqLLM();
      const response = await groqLLM.generateResponse(
        'Hello, this is a test message. Please respond briefly.',
        'You are a helpful AI assistant. Keep responses short and friendly.'
      );
      
      setTestResult(`✅ Groq LLM Test Successful!\n\nResponse: ${response}`);
    } catch (error) {
      setTestResult(`❌ Groq LLM Test Failed!\n\nError: ${error}`);
      console.error('Groq LLM test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testSystemComponents = async () => {
    setIsLoading(true);
    setTestResult('Testing system components...');
    
    const results = [];
    
    try {
      // Test Groq LLM
      const groqLLM = new GroqLLM();
      const groqResponse = await groqLLM.generateResponse('Test message');
      results.push('✅ Groq LLM: Working');
    } catch (error) {
      results.push('❌ Groq LLM: Failed');
    }

    try {
      // Test Custom TTS
      const { CustomTTS } = await import('@/lib/custom-tts');
      const customTTS = new CustomTTS();
      const ttsWorking = await customTTS.testTTS();
      results.push(ttsWorking ? '✅ Custom TTS: Working' : '❌ Custom TTS: Failed');
    } catch (error) {
      results.push('❌ Custom TTS: Failed');
    }

    setTestResult(results.join('\n'));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Voice AI System Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 rounded p-4">
              <h3 className="font-medium">Groq LLM</h3>
              <p className="text-sm text-gray-300">llama-3.1-8b-instant</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <h3 className="font-medium">Deepgram STT</h3>
              <p className="text-sm text-gray-300">Nova-2 Model</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <h3 className="font-medium">Custom TTS</h3>
              <p className="text-sm text-gray-300">odidev-tts</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={testGroqLLM}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 px-6 py-2 rounded font-medium"
            >
              {isLoading ? 'Testing...' : 'Test Groq LLM'}
            </button>
            
            <button
              onClick={testSystemComponents}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 px-6 py-2 rounded font-medium"
            >
              {isLoading ? 'Testing...' : 'Test All Components'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-900 p-4 rounded border">
              {testResult}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="flex gap-4">
            <a
              href="/voice-ai"
              className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded font-medium"
            >
              Voice AI Interface
            </a>
            <a
              href="/"
              className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded font-medium"
            >
              Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
