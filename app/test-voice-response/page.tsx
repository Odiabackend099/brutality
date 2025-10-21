'use client';

import { useState } from 'react';

export default function TestVoiceResponse() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testVoiceGeneration = async () => {
    setIsLoading(true);
    setTestResult('Testing voice generation...');
    
    try {
      const response = await fetch('/api/test-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Hello! This is a test of the voice response system. If you can hear this, the voice AI is working correctly.',
          voiceId: 'marcus'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setTestResult(`✅ Voice Generation Test Successful!\n\nResult: ${JSON.stringify(data.result, null, 2)}`);
      } else {
        setTestResult(`❌ Voice Generation Test Failed!\n\nError: ${data.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Voice Generation Test Failed!\n\nError: ${error}`);
      console.error('Voice generation test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Voice Response Test</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Voice Generation</h2>
          
          <div className="mb-6">
            <button
              onClick={testVoiceGeneration}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 px-6 py-3 rounded font-medium"
            >
              {isLoading ? 'Testing...' : 'Test Voice Generation'}
            </button>
          </div>
          
          {testResult && (
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-medium mb-2">Test Results:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {testResult}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Check that all environment variables are properly configured in <code className="bg-gray-700 px-1 rounded">.env.local</code></li>
            <li>Verify that the ODIADEV TTS API key is valid</li>
            <li>Ensure the voice AI manager is properly initialized</li>
            <li>Check browser console for any JavaScript errors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
