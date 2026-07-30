export default function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 hero-background" />

      <div className="absolute left-[-180px] top-[-160px] h-[700px] w-[700px] rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="absolute right-[-250px] bottom-[-200px] h-[650px] w-[650px] rounded-full bg-blue-500/10 blur-[200px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.04),transparent_45%)]" />
    </>
  );
}