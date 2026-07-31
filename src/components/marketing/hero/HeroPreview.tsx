/* eslint-disable react/no-unescaped-entities */
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Mic, Sparkles } from "lucide-react";

export default function HeroPreview() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="
            relative
            mx-auto
            mt-8
            w-full
            max-w-[560px]
            sm:max-w-[650px]
            lg:mt-0
            lg:max-w-[760px]
            xl:max-w-[860px]
            "    >
            {/* Glow */}

            <div className="absolute inset-0 -z-10 rounded-full bg-cyan-500/20 blur-[110px]" />

            {/* Browser Window */}

            <motion.div
                animate={{
                    y: [-4, 4, -4],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 6,
                    ease: "easeInOut",
                }}
                className="
                overflow-hidden
                rounded-[22px]
                lg:rounded-[28px]
                border
                border-white/10
                bg-[#101b2d]/80
                shadow-[0_20px_60px_rgba(0,0,0,.35)]
                lg:shadow-[0_25px_80px_rgba(0,0,0,.35)]
                backdrop-blur-xl
                "
            >
                {/* Browser Header */}

                <div className="flex h-12 items-center justify-between border-b border-white/5 px-5">
                    <div className="flex gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-red-300">
                        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
                        REC • 14:23
                    </div>
                </div>

                {/* Body */}

                <div className="
                grid
                gap-4
                p-4

                md:grid-cols-[1.5fr_1fr]

                xl:grid-cols-[1.65fr_.95fr]

                xl:gap-5
                xl:p-5
                ">
                    {/* LEFT COLUMN */}

                    <div className="flex flex-col gap-4">
                        {/* Interview Preview */}

                        <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-4 backdrop-blur-md">
                            <Image
                                src="/hero-preview2.png"
                                alt="Interview Preview"
                                width={1200}
                                height={700}
                                className="w-full rounded-xl object-cover"
                                priority
                            />
                        </div>

                        {/* Live Transcript */}

                        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-4 backdrop-blur-md">
                            <div className="mb-3 flex items-center gap-2 text-cyan-300">
                                <Mic size={16} />

                                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                                    Live Transcript
                                </span>
                            </div>

                            <p className="text-sm leading-6 text-slate-300">
                                Can you explain the time complexity of Dijkstra's algorithm and
                                why you would choose a priority queue instead of a simple array
                                implementation?
                            </p>

                            <div className="mt-4 flex gap-1">
                                <span className="h-2 w-8 animate-pulse rounded-full bg-cyan-400" />
                                <span className="h-2 w-5 animate-pulse rounded-full bg-cyan-400/70 delay-75" />
                                <span className="h-2 w-10 animate-pulse rounded-full bg-cyan-400 delay-150" />
                                <span className="h-2 w-6 animate-pulse rounded-full bg-cyan-400/70 delay-200" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}

                    <div className="flex h-full flex-col rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-cyan-500/5 to-transparent p-4 backdrop-blur-md">
                        <div className="mb-4 flex items-center gap-2">
                            <Brain
                                size={18}
                                className="text-cyan-300"
                            />

                            <span className="font-semibold text-white">
                                AI Suggestion
                            </span>
                        </div>

                        {/* Suggestions */}

                        <div className="space-y-3 text-sm leading-6 text-slate-300">
                            <p>• Mention O(E log V) complexity.</p>

                            <p>• Explain why a priority queue improves performance.</p>

                            <p>• Relate this to your route optimization project.</p>

                            <p>• Mention handling disconnected graphs.</p>
                        </div>

                        {/* Keywords */}

                        <div className="mt-6">
                            <div className="mb-3 flex items-center gap-2">
                                <Sparkles
                                    size={16}
                                    className="text-cyan-300"
                                />

                                <span className="text-sm text-slate-400">
                                    Keywords
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Graphs",
                                    "Priority Queue",
                                    "Binary Heap",
                                    "Optimization",
                                    "Complexity",
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium text-cyan-300"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Confidence */}

                        <div className="mt-auto pt-6">
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-slate-400">
                                    Confidence
                                </span>

                                <span className="font-semibold text-cyan-300">
                                    97%
                                </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[97%] rounded-full bg-cyan-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}