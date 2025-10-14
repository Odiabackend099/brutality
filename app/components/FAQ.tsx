const faqs = [
  {
    q: 'What makes CallWaiting AI different?',
    a: 'It handles real conversations in a natural voice — not just text. It replies fast, books appointments, and sends follow-ups.'
  },
  {
    q: 'Does it work with TikTok Shop & Shopify?',
    a: 'Yes. We’re built for creator commerce — DM + call handling across TikTok, WhatsApp, and phone.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — try it free. If you love it, pay a one-time setup ($300 Starter / $500 Pro).'
  },
  {
    q: 'Do I need coding skills?',
    a: 'No. It’s plug-and-play. We configure with you in under 48 hours.'
  },
  {
    q: 'How fast is setup?',
    a: 'Typically within 48 hours from your free trial sign-up.'
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">FAQs</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {faqs.map(({ q, a }) => (
            <div key={q} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <h3 className="font-bold">{q}</h3>
              <p className="mt-2 text-slate-300/90">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
