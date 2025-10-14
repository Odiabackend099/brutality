import { ArrowRight, Check } from 'lucide-react';

const FLW_STARTER = 'https://flutterwave.com/pay/tcasx4xsfmdj';
const FLW_PRO = 'https://flutterwave.com/pay/vcpp9rpmnvdm';

const features = ['48-Hour Setup', 'Human-Like Voice', '24/7 Available'];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Simple pricing that grows with you
          </h2>
          <p className="mt-3 text-slate-300/90">Start free. Pay setup when you’re ready.</p>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Starter */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
            <h3 className="text-xl font-bold">Starter</h3>
            <p className="text-slate-300/90 mt-1">Voice AI setup + 1 channel</p>
            <p className="text-4xl font-extrabold mt-4">
              $300<span className="text-base font-semibold text-slate-400"> one-time</span>
            </p>

            <ul className="mt-5 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-slate-300/90">
                  <Check className="w-4 h-4 text-emerald-400" /> {feature}
                </li>
              ))}
            </ul>

            <a href={FLW_STARTER} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
              Pay $300 Setup <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col">
            <h3 className="text-xl font-bold">Pro</h3>
            <p className="text-slate-300/90 mt-1">Multi-channel voice + WhatsApp + analytics</p>
            <p className="text-4xl font-extrabold mt-4">
              $500<span className="text-base font-semibold text-slate-400"> one-time</span>
            </p>

            <ul className="mt-5 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-slate-300/90">
                  <Check className="w-4 h-4 text-emerald-400" /> {feature}
                </li>
              ))}
            </ul>

            <a href={FLW_PRO} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
              Pay $500 Setup <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
