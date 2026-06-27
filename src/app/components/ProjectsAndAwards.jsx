"use client";

import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import TimeLineComponent from "./TimelineComponent";
import data from "../data/profile.json";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProjectsAndAwards() {
  return (
    <motion.div
      id="projects"
      className="flex w-full h-[50vh] gap-5"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Projects */}
      <div className="flex flex-col w-2/3 p-8 gap-6 rounded-[18px] bg-[#18181B]/45 border border-white/5">
        <span className="block text-white text-[24px] font-semibold">
          Projects
        </span>
        <ScrollArea className="h-[40vh]">
          <div className="flex flex-col gap-10">
            {data.projects.map((each, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <div className="flex gap-3 items-center flex-wrap">
                  <span className="text-white block text-[15px] font-medium">
                    {each.name}
                  </span>
                  <span className="text-white/60 text-[12px] px-3 py-1.5 bg-[#212125] rounded-full">
                    {each.duration}
                  </span>
                </div>
                <span className="font-normal text-[12px] text-[#C3C3C3]/60">
                  {each.location}
                </span>
                <div className="flex flex-col gap-2.5">
                  {each.details.map((detail, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <FaCheck className="text-[#12825F] size-3.5 shrink-0 mt-0.5" />
                      <span className="text-[12px] font-normal text-[#C3C3C3] leading-relaxed">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Education */}
      <div className="flex gap-8 flex-col w-1/3 p-8 rounded-[18px] bg-[#18181B]/45 border border-white/5">
        <div className="flex gap-3 items-center flex-wrap">
          <span className="block text-white text-[24px] font-semibold">
            Education
          </span>
          <span className="block text-white px-3 py-1.5 bg-[#12825F]/20 border border-[#12825F]/40 text-[#12825F] rounded-full text-[14px] font-medium">
            B.Tech
          </span>
        </div>
        <div>
          <TimeLineComponent data={data.education} />
        </div>
      </div>
    </motion.div>
  );
}
