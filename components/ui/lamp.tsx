"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center overflow-hidden bg-night w-full rounded-md z-0",
        className
      )}
    >
      {/* red wash bleeding down from the beam through the title/form below,
          fading into the night bg so the glow doesn't stop at a hard line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[64rem] max-h-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 70% at 50% 0%, color-mix(in srgb, var(--color-accent) 50%, transparent) 0%, color-mix(in srgb, var(--color-accent) 30%, transparent) 25%, color-mix(in srgb, var(--color-accent) 14%, transparent) 50%, color-mix(in srgb, var(--color-accent) 5%, transparent) 72%, transparent 92%)",
        }}
      />

      <div className="relative flex w-full h-[24rem] md:h-[30rem] scale-y-125 items-center justify-center isolate z-10 ">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, var(--color-accent), transparent, transparent)",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] text-white"
        >
          <div className="absolute  w-[100%] left-0 bg-night h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, transparent, transparent, var(--color-accent))",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] text-white"
        >
          <div className="absolute  w-[100%] right-0 bg-night h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-night blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-48 w-[40rem] -translate-y-1/2 rounded-full bg-accent opacity-90 blur-3xl"></div>
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-40 w-72 -translate-y-[6rem] rounded-full bg-accent opacity-90 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-accent "
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-night blur-xl [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      </div>

      <div className="relative z-20 flex -translate-y-56 md:-translate-y-72 flex-col items-center px-5 w-full pb-16 md:pb-24">
        {children}
      </div>
    </div>
  );
};
