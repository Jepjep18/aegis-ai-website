import WorkflowGrid from "./WorkflowGrid";
import WorkflowHeader from "./WorkflowHeader";

export default function Workflow() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Glow */}

      <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[160px]" />

      {/* Grid Pattern */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <WorkflowHeader />

        <WorkflowGrid />
      </div>
    </section>
  );
}