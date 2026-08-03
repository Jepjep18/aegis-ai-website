import BrandingWorkspace from "../branding/BrandingWorkspace";

export default function AuthBranding() {
  return (
    <div className="hidden lg:flex flex-col">

      <span className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
        AI Interview Copilot
      </span>

      <h1 className="mt-8 text-6xl font-bold leading-tight tracking-tight text-white">
        Prepare Like
        <br />

        <span className="bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent italic">
          Top Engineers.
        </span>
      </h1>

      <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
        Upload your resume, analyze any job description, and let
        Aegis prepare personalized interview answers based on
        your own experience.
      </p>

      <div className="mt-10">
        <BrandingWorkspace />
      </div>

    </div>
  );
}