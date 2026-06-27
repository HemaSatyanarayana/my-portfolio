"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import data from "../data/profile.json";

const textVariants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0 },
};

function initials(name) {
  return name.split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).join("");
}

export default function Introduction({ name, role, avatar }) {
  const nameParts = name.split(/\n/).map(p => p.trim()).filter(Boolean);
  return (
    <motion.div
      id="about"
      className="flex flex-col-reverse md:flex-row md:items-center gap-8 py-8 md:h-[400px] md:gap-0"
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.18 }}
    >
      {/* Text */}
      <div className="flex flex-col md:w-2/3 gap-1.5 justify-center">
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-semibold text-white/60 text-[22px] md:text-[27px] block"
        >
          {data.intro.greeting}
        </motion.span>
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-semibold text-white text-[28px] md:text-[35px] block"
        >
          I&apos;m {nameParts[0]}
        </motion.span>
        {nameParts.slice(1).map((part, i) => (
          <motion.span
            key={i}
            variants={textVariants}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-semibold text-white text-[28px] md:text-[35px] block"
          >
            {part},
          </motion.span>
        ))}
        <motion.span
          variants={textVariants}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-semibold text-white text-[28px] md:text-[35px] block"
        >
          {role}.
        </motion.span>
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex gap-2 mt-3 flex-wrap"
        >
          {data.intro.techTags.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-[12px] rounded-full bg-[#18181B] text-[#C3C3C3] border border-white/10 hover:border-[#12825F]/60 hover:text-white transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Avatar — scanner corners only, no rings */}
      <motion.div
        className="flex md:w-1/3 items-center justify-center"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        <div className="relative size-36 md:size-44">
          {/* Scanner corner brackets */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-[#12825F]/80 rounded-tl-[6px]" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-[#12825F]/80 rounded-tr-[6px]" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-[#12825F]/80 rounded-bl-[6px]" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-[#12825F]/80 rounded-br-[6px]" />

          {/* Card */}
          <div className="size-full bg-[#18181B] rounded-[25px] shadow-[0_0_48px_rgba(18,130,95,0.18)] overflow-hidden flex items-center justify-center">
            {avatar ? (
              <Image src={avatar} alt={name} fill className="object-cover" unoptimized />
            ) : (
              <span className="text-[40px] md:text-[47px] font-bold text-[#12825F] select-none">{initials(name)}</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
