import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <HeroBackground />

      <div
        className="
          relative
          mx-auto
          max-w-[1440px]
          px-6
          pt-28
          pb-12
          lg:h-[calc(100vh-80px)]
          lg:px-10
          lg:pt-20
          lg:pb-0
          lg:flex
          lg:items-center
        "
      >
        <div
          className="
            grid
            items-center
            gap-14
            lg:grid-cols-[0.85fr_1.15fr]
          "
        >
          <HeroContent />

          <HeroPreview />
        </div>
      </div>
    </section>
  );
}