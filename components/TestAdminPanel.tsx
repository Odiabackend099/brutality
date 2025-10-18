'use client';

import React, { useState } from 'react';
import { Settings, UserPlus, Phone, Bot, CheckCircle, AlertCircle } from 'lucide-react';

interface TestAdminPanelProps {
  isVisible: boolean;
}

interface TestAccountData {
  userId: string;
  email: string;
  password: string;
  agentId: string;
  phoneNumber: string;
  voiceId: string;
  testMode: boolean;
}

export default function TestAdminPanel({ isVisible }: TestAdminPanelProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [testAccount, setTestAccount] = useState<TestAccountData | null>(null);
  const [error, setError] = useState('');

  if (!isVisible) {
    return null;
  }

  const createTestAccount = async () => {
    if (!adminPassword.trim()) {
      setError('Please enter admin password');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const response = await fetch('/api/admin/test-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test account');
      }

      setTestAccount(data.data);
      setAdminPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-6 max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-semibold text-white">Test Admin Panel</h3>
        <div className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
          TEST MODE
        </div>
      </div>

      {!testAccount ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={createTestAccount}
            disabled={isCreating || !adminPassword.trim()}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Test Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Create Test Account
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Test account created successfully!
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Test User Email
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testAccount.email}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(testAccount.email)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Test Password
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testAccount.password}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(testAccount.password)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Test Phone Number
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testAccount.phoneNumber}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(testAccount.phoneNumber)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Agent ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testAccount.agentId}
                  readOnly
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(testAccount.agentId)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <h4 className="text-sm font-medium text-white mb-2">Test Features Available:</h4>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Bot className="w-3 h-3 text-cyan-400" />
                AI Agent with Marcus voice
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-cyan-400" />
                Twilio phone number integration
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-cyan-400" />
                Payment bypass (free testing)
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-cyan-400" />
                Call logging and transcripts
              </div>
            </div>
          </div>

          <button
            onClick={() => setTestAccount(null)}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Create Another Test Account
          </button>
        </div>
      )}
    </div>
  );
}
