"use client";

import { motion } from "framer-motion";

import WorkflowCard from "./WorkflowCard";
import { workflowSteps } from "./workflow-data";

export default function WorkflowGrid() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: 0.25,
      }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="
        grid
        gap-6
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {workflowSteps.map((step) => (
        <motion.div
          key={step.step}
          variants={{
            hidden: {
              opacity: 0,
              y: 30,
            },
            show: {
              opacity: 1,
              y: 0,
            },
          }}
        >
          <WorkflowCard {...step} />
        </motion.div>
      ))}
    </motion.div>
  );
}