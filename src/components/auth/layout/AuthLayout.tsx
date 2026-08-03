"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import AuthBranding from "./AuthBranding";
import AuthCard from "./AuthCard";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#07111F]">
      {/* Background Grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          [background-image:
          linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)]
          [background-size:48px_48px]
        "
      />

      {/* Left Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.18, 0.3, 0.18],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          left-[18%]
          top-20
          h-[620px]
          w-[620px]
          rounded-full
          bg-cyan-400/20
          blur-[170px]
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          scale: [1.05, 1, 1.05],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -right-24
          bottom-0
          h-[500px]
          w-[500px]
          rounded-full
          bg-sky-500/15
          blur-[150px]
        "
      />

      {/* Top Accent */}
      <div
        className="
          absolute
          left-1/2
          top-0
          h-40
          w-[700px]
          -translate-x-1/2
          bg-gradient-to-b
          from-cyan-400/10
          to-transparent
          blur-3xl
        "
      />

      {/* Content */}
      <div
        className="
          relative
          mx-auto
          flex
          min-h-[100svh]
          max-w-[1600px]
          items-center
          px-6
          py-10
          lg:px-10
          xl:px-14
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-16
            xl:gap-24
            lg:grid-cols-[1.25fr_.75fr]
          "
        >
          {/* Branding */}
          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <AuthBranding />
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
            }}
            className="mx-auto w-full max-w-md"
          >
            <AuthCard>
              {children}
            </AuthCard>
          </motion.div>
        </div>
      </div>
    </main>
  );
}