"use client";

import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TimeLineComponent({ data }) {
  return (
    <ScrollArea className="h-[35vh]">
      <div className="flex flex-col">
        {data.map((d, idx) => (
          <motion.div
            key={idx}
            className="flex w-full h-24 shrink-0"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="w-1/12 pt-1">
              <div
                className="size-3 rounded-full relative z-[2]"
                style={{ backgroundColor: idx === 0 ? "#12825F" : "#222224" }}
              >
                {idx !== data.length - 1 && (
                  <div className="absolute h-[92px] w-[1px] bg-[#222224] left-[50%] -translate-x-[50%] top-[50%] rounded-full" />
                )}
              </div>
            </div>
            <div className="w-8/12 flex flex-col gap-0.5">
              <span className="text-[14px] font-medium text-white leading-tight">
                {d.name}
              </span>
              <span className="font-normal text-[12px] text-[#12825F]">
                {d.company || d.institution || ""}
              </span>
              <span className="font-normal text-[12px] text-[#C3C3C3] mt-0.5">
                {d.description}
              </span>
            </div>
            <div className="w-3/12 flex items-start justify-end">
              <span className="bg-[#18181B] px-2 py-1 text-[12px] font-normal text-white rounded-full whitespace-nowrap">
                {d.timeLineDuration}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  );
}
