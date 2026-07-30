import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroContent() {
    return (
        <div className="max-w-[560px]">
            {/* Badge */}

            <div className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                AI Interview Copilot
            </div>

            {/* Heading */}

            <h1 className="mt-8 max-w-[560px] text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[52px] lg:leading-[1.05]">
                Ace Every
                <br />

                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    Technical Interview
                </span>

                <span className="text-slate-300">
                    <br />
                    With Confidence.
                </span>
            </h1>

            {/* Description */}

            <p className="mt-6 max-w-[520px] text-lg leading-8 text-slate-400">
                Upload your resume, paste a job description, and let Aegis generate
                interview answers that are personalized to your own experience—not
                generic AI responses.
            </p>

            {/* CTA */}

            <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                    size="lg"
                    className="h-12 rounded-xl px-7 text-base"
                >
                    Get Started

                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl border-white/10 bg-white/5 px-7 text-base hover:bg-white/10"
                >
                    <Play className="mr-2 h-4 w-4" />

                    Watch Demo
                </Button>
            </div>

            {/* Social Proof */}

            <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#051424] bg-gradient-to-br from-cyan-400 to-blue-500 text-xs font-semibold text-white"
                        >
                            {item}
                        </div>
                    ))}
                </div>

                <div>
                    <p className="text-sm font-semibold text-white">
                        Trusted by Software Engineers
                    </p>

                    <p className="text-sm text-slate-400">
                        Prepare faster. Interview with confidence.
                    </p>
                </div>
            </div>
        </div>
    );
}