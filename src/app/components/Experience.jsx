"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import data from "../data/profile.json";

export default function Experience() {
  const [active, setActive] = useState(0);
  const exp = data.experiences[active];

  return (
    <motion.section
      id="experience"
      className="w-full rounded-[22px] bg-[#18181B]/45 border border-white/5 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Tab bar */}
      <div className="flex border-b border-white/8">
        {data.experiences.map((e, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`relative flex-1 px-6 py-5 text-left transition-all duration-200 ${
              active !== idx ? "hover:bg-white/[0.03]" : ""
            }`}
          >
            <span
              className={`block text-[14px] font-semibold leading-snug transition-colors duration-200 ${
                active === idx ? "text-white" : "text-white/35"
              }`}
            >
              {e.name}
            </span>
            <span
              className={`block text-[12px] mt-1 transition-colors duration-200 ${
                active === idx ? "text-[#12825F]" : "text-white/25"
              }`}
            >
              {e.company} &middot; {e.duration}
            </span>

            {active === idx && (
              <motion.div
                layoutId="tab-line"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#12825F]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="px-10 py-8"
        >
          {/* Role header */}
          <div className="mb-7">
            <h2 className="text-[20px] font-bold text-white tracking-tight">
              {exp.name}
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center mt-2">
              <span className="text-[14px] font-medium text-[#12825F]">
                @ {exp.company}
              </span>
              <span className="text-white/25 text-[14px]">·</span>
              <span className="text-white/55 text-[14px]">{exp.duration}</span>
              <span className="text-white/25 text-[14px]">·</span>
              <span className="text-white/40 text-[12px]">{exp.location}</span>
            </div>
          </div>

          {/* Bullet points */}
          <div className="flex flex-col gap-4">
            {exp.details.map((detail, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: i * 0.04, ease: "easeOut" }}
                className="flex gap-4 items-start"
              >
                <FaCheck className="text-[#12825F] size-3.5 shrink-0 mt-[3px]" />
                <span className="text-[13px] font-normal text-[#C3C3C3] leading-[1.7]">
                  {detail}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
