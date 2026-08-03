export default function WorkflowHeader() {
  return (
    <div className="mx-auto mb-20 max-w-3xl text-center">
      {/* Badge */}

      <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
        How Aegis Works
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-4xl font-bold leading-tight text-white lg:text-5xl">
        From Resume to
        <br />

        <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent italic">
          Real-Time AI Interview Assistance
        </span>
      </h2>

      {/* Description */}

      <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400">
        Aegis prepares every interview using your own experience,
        then becomes your AI copilot during the interview itself.
      </p>
    </div>
  );
}