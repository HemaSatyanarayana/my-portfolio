"use client";

import { useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

function ImageModal({ src, alt, onClose }) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center cursor-zoom-out"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
        <motion.div
          className="relative z-10 cursor-zoom-out"
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.82, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
        >
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
            unoptimized
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export default function FeatureSection({ title, description, image, imageAlt, flip = false }) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <div className={`flex flex-col gap-8 py-6 md:items-center md:gap-12 md:min-h-[280px] ${flip ? "md:flex-row-reverse" : "md:flex-row"}`}>
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-white text-[22px] md:text-[24px] font-semibold leading-snug">{title}</h2>
          <p className="text-white/50 text-[13.5px] md:text-[14px] leading-relaxed">{description}</p>
        </div>

        {image && (
          <div className="flex-1 flex items-center justify-center">
            <div
              className="relative w-full max-w-[420px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] cursor-zoom-in transition-colors duration-200"
              onClick={() => setZoomed(true)}
            >
              <Image
                src={image}
                alt={imageAlt}
                width={420}
                height={260}
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>

      {zoomed && typeof document !== "undefined" && (
        <ImageModal src={image} alt={imageAlt} onClose={() => setZoomed(false)} />
      )}
    </>
  );
}
