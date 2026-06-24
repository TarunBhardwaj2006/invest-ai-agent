export function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            IA
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
              Multi-Agent AI Platform
            </p>
          </div>
        </div>

        <div className="mt-6 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="gradient-text">InvestAI</span>
            <span className="text-slate-100"> — Multi-Agent Investment Research Platform</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-400 sm:text-lg">
            Analyze companies using AI-powered investment research.
          </p>
        </div>
      </div>
    </header>
  );
}
