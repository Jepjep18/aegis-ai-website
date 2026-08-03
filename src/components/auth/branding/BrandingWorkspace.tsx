"use client";

import { motion } from "framer-motion";

import { GlassCard } from "@/components/shared/glass-card";

import BrandingProgress from "./BrandingProgress";
import BrandingStatus from "./BrandingStatus";

export default function BrandingWorkspace() {
  return (
    <motion.div
      animate={{
        y: [-4, 4, -4],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <GlassCard className="p-6">
        <div className="space-y-5">

          <BrandingStatus
            title="Resume Uploaded"
            subtitle="SoftwareEngineer_Resume.pdf"
          />

          <BrandingStatus
            title="Job Description Parsed"
            subtitle="Senior Full Stack Developer"
          />

          <BrandingProgress
            title="Analyzing Resume"
            width="94%"
          />

          <BrandingProgress
            title="Matching Experience"
            width="88%"
          />

          <BrandingProgress
            title="Generating Interview Context"
            width="97%"
          />

          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-400" />

              <p className="text-sm font-medium text-cyan-300">
                Interview Session Ready
              </p>
            </div>
          </div>

        </div>
      </GlassCard>
    </motion.div>
  );
}