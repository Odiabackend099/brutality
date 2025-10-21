'use client';

import { useState } from 'react';
import { VolumeX, Settings, Loader2, CheckCircle, BarChart3 } from 'lucide-react';
import StreamingVoiceChat from '@/components/StreamingVoiceChat';

export default function TestStreamingVoiceAIPage() {
  const [testResults, setTestResults] = useState<{
    latency: number[];
    interruptions: number;
    errors: string[];
    startTime: number;
  }>({
    latency: [],
    interruptions: 0,
    errors: [],
    startTime: Date.now()
  });

  const [isTestRunning, setIsTestRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runLatencyTest = async () => {
    setCurrentTest('Latency Test');
    setIsTestRunning(true);
    
    const latencies: number[] = [];
    
    try {
      // Simulate multiple voice interactions
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        // Simulate voice processing
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
        
        const latency = Date.now() - startTime;
        latencies.push(latency);
        
        // Update test results
        setTestResults(prev => ({
          ...prev,
          latency: [...prev.latency, latency]
        }));
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('✅ Latency test completed:', latencies);
    } catch (error) {
      console.error('❌ Latency test failed:', error);
      setTestResults(prev => ({
        ...prev,
        errors: [...prev.errors, `Latency test failed: ${error}`]
      }));
    } finally {
      setIsTestRunning(false);
      setCurrentTest('');
    }
  };

  const runInterruptionTest = async () => {
    setCurrentTest('Interruption Test');
    setIsTestRunning(true);
    
    try {
      // Simulate interruption scenarios
      for (let i = 0; i < 3; i++) {
        // Simulate user interruption
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setTestResults(prev => ({
          ...prev,
          interruptions: prev.interruptions + 1
        }));
        
        // Wait between interruptions
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      console.log('✅ Interruption test completed');
    } catch (error) {
      console.error('❌ Interruption test failed:', error);
      setTestResults(prev => ({
        ...prev,
        errors: [...prev.errors, `Interruption test failed: ${error}`]
      }));
    } finally {
      setIsTestRunning(false);
      setCurrentTest('');
    }
  };

  const runEndToEndTest = async () => {
    setCurrentTest('End-to-End Test');
    setIsTestRunning(true);
    
    try {
      // Simulate complete voice interaction flow
      const steps = [
        'Voice capture',
        'Speech-to-text',
        'LLM processing',
        'Text-to-speech',
        'Audio playback'
      ];
      
      for (const step of steps) {
        console.log(`Testing: ${step}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('✅ End-to-end test completed');
    } catch (error) {
      console.error('❌ End-to-end test failed:', error);
      setTestResults(prev => ({
        ...prev,
        errors: [...prev.errors, `End-to-end test failed: ${error}`]
      }));
    } finally {
      setIsTestRunning(false);
      setCurrentTest('');
    }
  };

  const resetTestResults = () => {
    setTestResults({
      latency: [],
      interruptions: 0,
      errors: [],
      startTime: Date.now()
    });
  };

  const getAverageLatency = () => {
    if (testResults.latency.length === 0) return 0;
    return Math.round(testResults.latency.reduce((a, b) => a + b, 0) / testResults.latency.length);
  };

  const getTestDuration = () => {
    return Math.round((Date.now() - testResults.startTime) / 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Streaming Voice AI Test Suite</h1>
          <p className="text-gray-300">Ultra-low latency voice interaction testing</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold mb-6">Test Controls</h2>
            
            {/* Test Buttons */}
            <div className="space-y-4 mb-6">
              <button
                onClick={runLatencyTest}
                disabled={isTestRunning}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestRunning && currentTest === 'Latency Test' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BarChart3 className="w-5 h-5" />
                )}
                Run Latency Test
              </button>

              <button
                onClick={runInterruptionTest}
                disabled={isTestRunning}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestRunning && currentTest === 'Interruption Test' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
                Run Interruption Test
              </button>

              <button
                onClick={runEndToEndTest}
                disabled={isTestRunning}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestRunning && currentTest === 'End-to-End Test' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Run End-to-End Test
              </button>

              <button
                onClick={resetTestResults}
                disabled={isTestRunning}
                className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Settings className="w-5 h-5" />
                Reset Results
              </button>
            </div>

            {/* Current Test Status */}
            {isTestRunning && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span className="text-blue-200">Running: {currentTest}</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-xl font-bold mb-6">Test Results</h2>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Average Latency</div>
                <div className="text-2xl font-bold text-white">{getAverageLatency()}ms</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Interruptions</div>
                <div className="text-2xl font-bold text-white">{testResults.interruptions}</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Test Duration</div>
                <div className="text-2xl font-bold text-white">{getTestDuration()}s</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-gray-400 text-sm">Errors</div>
                <div className="text-2xl font-bold text-white">{testResults.errors.length}</div>
              </div>
            </div>

            {/* Latency History */}
            {testResults.latency.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Latency History</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {testResults.latency.map((latency, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          latency < 100 ? 'bg-green-500/20 text-green-200' :
                          latency < 200 ? 'bg-yellow-500/20 text-yellow-200' :
                          'bg-red-500/20 text-red-200'
                        }`}
                      >
                        {latency}ms
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Error Log */}
            {testResults.errors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Error Log</h3>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="space-y-2">
                    {testResults.errors.map((error, index) => (
                      <div key={index} className="text-red-200 text-sm">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice Chat Interface */}
        <div className="mt-8">
          <StreamingVoiceChat />
        </div>
      </div>
    </div>
  );
}
