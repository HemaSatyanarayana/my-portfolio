import { FaCheck } from "react-icons/fa6";
import TimeLineComponent from "./TimelineComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import data from ".././data/profile.json";

export default function Experience() {
  return (
    <div className="flex w-full h-[60vh] gap-2">
      {/* Experience Representation*/}

      <div className="flex gap-10 flex-col w-1/3 p-8 rounded-xl bg-[#18181B]/65">
        <div className="flex gap-5 items-center">
          <span className="block text-gradient-to-r from-slate-50 to text-slate-300 text-2xl font-semibold">
            Experience
          </span>
          <span className="block text-white px-4 py-1.5 bg-[#12825F] rounded-full">
          {data.totalExperienceInYears} Years
          </span>
        </div>

        {/* Timeline */}
        <div>
          <TimeLineComponent data={data.experiences} />
        </div>
      </div>

      {/* Experience Description */}
      <div className="flex flex-col w-2/3 p-8 gap-6 rounded-xl bg-[#18181B]/65">
        <span className="block text-gradient-to-r from-slate-50 to text-slate-300 text-2xl font-semibold">
          Professional Experience
        </span>
        <ScrollArea className="max-h-[55vh]">
          <div className="flex flex-col gap-12">
            {data.experiences.map((each, idx) => (
              <div>
                <div className="flex flex-col gap-2 pb-2">
                  <div className="flex gap-3 items-center">
                    <span className="text-gradient-to-r from-slate-50 to text-slate-300 block text-base font-medium">
                      {each.name}
                    </span>
                    <span className="text-gradient-to-r from-slate-50 to text-slate-300 text-xs px-4 py-2 bg-[#212125] rounded-full">
                      {each.duration}
                    </span>
                  </div>
                  <span className="font-normal text-xs py-2 text-[#9ca3af]">
                    {each.location}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {each.details.map((detail, idx) => (
                    <div className="flex gap-2">
                      <FaCheck className="text-[#12825F] size-5 shrink-0" />
                      <span className="text-xs font-normal text-[#e5e7eb]">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
