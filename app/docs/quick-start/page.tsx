import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quick Start Guide | CallWaitingAI',
  description: 'Get up and running with CallWaitingAI in 7 minutes. Complete setup guide for your AI receptionist.',
};

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Quick Start Guide
            </h1>
            <p className="text-xl text-gray-300">
              Get your AI receptionist up and running in just 7 minutes
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🚀 Getting Started</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Create Your Account</h3>
                  <p className="text-gray-300 mb-2">
                    Sign up for CallWaitingAI and verify your email address.
                  </p>
                  <Link 
                    href="/signup" 
                    className="inline-flex items-center bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Sign Up Now
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Set Up Your AI Agent</h3>
                  <p className="text-gray-300 mb-2">
                    Configure your AI receptionist with your business information, greeting message, and voice preferences.
                  </p>
                  <Link 
                    href="/create-agent" 
                    className="inline-flex items-center bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create Agent
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Get Your Phone Number</h3>
                  <p className="text-gray-300 mb-2">
                    Choose a new phone number or forward your existing number to your AI agent.
                  </p>
                  <div className="bg-slate-800 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <strong>Option A:</strong> Get a new UK number from us<br/>
                      <strong>Option B:</strong> Forward your existing number
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Test Your Setup</h3>
                  <p className="text-gray-300 mb-2">
                    Call your new number to test your AI receptionist and make sure everything works perfectly.
                  </p>
                  <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-green-300 text-sm">
                      💡 <strong>Pro Tip:</strong> Test during business hours to ensure your AI handles calls exactly as you want.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">⚙️ Configuration Options</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Voice Settings</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Choose from multiple UK-accented voices</li>
                  <li>• Adjust speaking speed and tone</li>
                  <li>• Customize greeting messages</li>
                  <li>• Set conversation flow preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Business Information</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Company name and description</li>
                  <li>• Services and pricing information</li>
                  <li>• Business hours and availability</li>
                  <li>• Contact preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">📞 Call Handling Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Lead Qualification</h3>
                <p className="text-gray-300 text-sm">
                  AI asks qualifying questions and captures essential customer information automatically.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Appointment Booking</h3>
                <p className="text-gray-300 text-sm">
                  Integrates with your calendar to book appointments and send confirmations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-cyan-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Multi-Channel Delivery</h3>
                <p className="text-gray-300 text-sm">
                  Receive call summaries via SMS, email, or your preferred CRM system.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">🔧 Advanced Setup</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Calendar Integration</h3>
                <p className="text-gray-300 mb-2">
                  Connect your Google Calendar, Outlook, or Calendly for seamless appointment booking.
                </p>
                <Link href="/integrations" className="text-cyan-400 hover:text-cyan-300">
                  View Integration Options →
                </Link>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">CRM Integration</h3>
                <p className="text-gray-300 mb-2">
                  Sync leads and customer data with your existing CRM system.
                </p>
                <Link href="/integrations" className="text-cyan-400 hover:text-cyan-300">
                  View Integration Options →
                </Link>
              </div>
              
              <div className="border-l-4 border-cyan-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">Custom Workflows</h3>
                <p className="text-gray-300 mb-2">
                  Create custom call flows for different types of inquiries or business scenarios.
                </p>
                <Link href="/dashboard/flows" className="text-cyan-400 hover:text-cyan-300">
                  Manage Workflows →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-cyan-100 mb-6">
              Join thousands of UK businesses already using CallWaitingAI to never miss another paying call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup" 
                className="bg-white text-cyan-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Need Help?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq" className="text-cyan-400 hover:text-cyan-300">
                Frequently Asked Questions
              </Link>
              <Link href="/contact" className="text-cyan-400 hover:text-cyan-300">
                Contact Support
              </Link>
              <Link href="/resources" className="text-cyan-400 hover:text-cyan-300">
                Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

