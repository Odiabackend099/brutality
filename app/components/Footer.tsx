export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80">
      <div className="container py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-slate-400">© {new Date().getFullYear()} CallWaiting AI. Handled by CallWaiting AI.</p>
        <div className="flex gap-5 text-slate-400">
          <a href="#pricing" className="hover:text-slate-200">
            Pricing
          </a>
          <a href="#faq" className="hover:text-slate-200">
            FAQ
          </a>
          <a href="mailto:callwaitingai@gmail.com" className="hover:text-slate-200">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
