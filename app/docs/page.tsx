import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Documentation | CallWaitingAI',
  description: 'Complete documentation for CallWaitingAI - your AI receptionist platform.',
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              CallWaitingAI Documentation
            </h1>
            <p className="text-xl text-gray-300">
              Everything you need to get started with your AI receptionist
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/docs/quick-start" className="bg-slate-900 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Quick Start Guide</h2>
                <p className="text-gray-300">
                  Get up and running with CallWaitingAI in just 7 minutes. Perfect for new users.
                </p>
              </div>
            </Link>

            <Link href="/resources" className="bg-slate-900 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Full Documentation</h2>
                <p className="text-gray-300">
                  Complete technical documentation, API reference, and advanced guides.
                </p>
              </div>
            </Link>

            <Link href="/faq" className="bg-slate-900 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❓</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">FAQ</h2>
                <p className="text-gray-300">
                  Frequently asked questions and troubleshooting guides.
                </p>
              </div>
            </Link>

            <Link href="/contact" className="bg-slate-900 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-3">Support</h2>
                <p className="text-gray-300">
                  Get help from our support team or contact sales for enterprise needs.
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Popular Topics</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Getting Started</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <Link href="/docs/quick-start" className="text-cyan-400 hover:text-cyan-300">Quick Start Guide</Link></li>
                  <li>• <Link href="/create-agent" className="text-cyan-400 hover:text-cyan-300">Creating Your First Agent</Link></li>
                  <li>• <Link href="/dashboard/phone" className="text-cyan-400 hover:text-cyan-300">Setting Up Phone Numbers</Link></li>
                  <li>• <Link href="/pricing" className="text-cyan-400 hover:text-cyan-300">Understanding Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Advanced Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <Link href="/integrations" className="text-cyan-400 hover:text-cyan-300">Integrations & APIs</Link></li>
                  <li>• <Link href="/dashboard/flows" className="text-cyan-400 hover:text-cyan-300">Custom Call Flows</Link></li>
                  <li>• <Link href="/dashboard/agents" className="text-cyan-400 hover:text-cyan-300">Managing Agents</Link></li>
                  <li>• <Link href="/dashboard/calls" className="text-cyan-400 hover:text-cyan-300">Call Analytics</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

