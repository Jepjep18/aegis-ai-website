"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface WorkflowCardProps {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function WorkflowCard({
  step,
  icon: Icon,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-8
        backdrop-blur-xl
      "
    >
      {/* Glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Step */}

      <span className="font-mono text-xs tracking-[0.3em] text-cyan-300">
        STEP {step}
      </span>

      {/* Icon */}

      <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
        <Icon size={28} />
      </div>

      {/* Title */}

      <h3 className="mt-6 text-xl font-semibold text-white">
        {title}
      </h3>

      {/* Description */}

      <p className="mt-3 leading-7 text-slate-400">
        {description}
      </p>
    </motion.div>
  );
}