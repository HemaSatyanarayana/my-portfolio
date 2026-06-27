"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "About me",   id: "about" },
  { label: "Tech Stack", id: "skills" },
  { label: "Features",   id: "feature-1" },
  { label: "Education",  id: "education" },
  { label: "Contact me", id: "contact" },
];

export default function HeaderComponent() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      {/* Desktop: floating pill */}
      <div className="hidden md:flex justify-center items-center fixed top-4 left-0 right-0 z-50">
        <div className="bg-[#18181B]/80 backdrop-blur-md rounded-[80px] p-2 border border-white/5 flex items-center gap-0">
          {NAV_ITEMS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-white/70 hover:text-white font-normal text-[14px] px-3.5 py-2 rounded-full hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: hamburger button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 flex flex-col items-center justify-center gap-[5px] bg-[#18181B]/80 backdrop-blur-md rounded-full border border-white/10"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <motion.span
          className="block w-[18px] h-[1.5px] bg-white/80 origin-center"
          animate={open ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.22 }}
        />
        <motion.span
          className="block w-[18px] h-[1.5px] bg-white/80"
          animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="block w-[18px] h-[1.5px] bg-white/80 origin-center"
          animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.22 }}
        />
      </button>

      {/* Mobile: fullscreen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#050505]/95 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_ITEMS.map(({ label, id }, i) => (
              <motion.button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-white/60 hover:text-white text-[26px] font-medium tracking-wide transition-colors duration-200"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: i * 0.07, duration: 0.28, ease: "easeOut" }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
