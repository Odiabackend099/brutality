import Logo from './Logo';

export default function Navigation() {
  return (
    <nav className="max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between relative z-10">
      <Logo size="md" showText={true} />
      <div className="flex items-center gap-6">
        <a
          href="/tools"
          className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
        >
          Free Tools
        </a>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium text-slate-300 hover:text-white transition-colors"
        >
          Log In
        </a>
        <a
          href="/signup"
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Sign Up Free
        </a>
      </div>
    </nav>
  );
}
