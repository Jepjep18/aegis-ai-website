export default function AuthBranding() {
  return (
    <aside className="relative hidden w-[45%] overflow-hidden border-r border-white/10 lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0EA5E955,transparent_60%)]" />

      <div className="relative z-10 flex flex-col justify-center px-16">
        <span className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
          AEGIS AI
        </span>

        <h1 className="text-5xl font-bold leading-tight text-white">
          Ace Every
          <br />
          Technical Interview.
        </h1>

        <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
          Your AI interview copilot that prepares personalized answers based on
          your resume and the job description.
        </p>
      </div>
    </aside>
  );
}