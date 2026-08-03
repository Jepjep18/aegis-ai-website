"use client";

import { motion } from "framer-motion";

interface BrandingProgressProps {
  title: string;
  width: string;
}

export default function BrandingProgress({
  title,
  width,
}: BrandingProgressProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-300">
          {title}
        </span>

        <span className="text-xs text-cyan-300">
          AI
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{
            duration: 1.2,
          }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
        />
      </div>
    </div>
  );
}