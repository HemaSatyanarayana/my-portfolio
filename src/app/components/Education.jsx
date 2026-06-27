"use client";

import { motion } from "framer-motion";
import data from "../data/profile.json";

export default function Education() {
  return (
    <motion.section
      id="education"
      className="w-full pb-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <p className="text-white/30 text-[12px] tracking-[0.25em] uppercase font-medium mb-6 text-center">
        Education
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.education.map((edu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.12, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-[18px] bg-[#18181B]/45 border border-white/5 p-6 md:p-8 flex flex-col gap-3"
          >
            <span className="text-[#12825F] text-[11px] tracking-[0.2em] uppercase font-medium">
              {edu.timeLineDuration}
            </span>
            <div>
              <h3 className="text-[15px] font-semibold text-white leading-snug">{edu.name}</h3>
              <p className="text-[14px] text-[#12825F]/80 mt-0.5">{edu.institution}</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-white/40 mt-auto pt-2 border-t border-white/5">
              <span>{edu.location}</span>
              <span className="text-white/20">·</span>
              <span className="text-white/60 font-medium">{edu.description}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
