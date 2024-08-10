import { ScrollArea } from "@/components/ui/scroll-area";

export default function TimeLineComponent({ data }) {
  return (
    <ScrollArea className={"h-[35vh]"}>
      <div className="flex flex-col">
        {data.map((d, idx) => (
          <div key={idx} className="flex w-full h-24 shrink-0">
            <div className="w-1/12 pt-1">
              <div
                className={"size-4 rounded-full relative z-2"}
                style={{
                  backgroundColor: idx === 0 ? "#12825F" : "#222224",
                }}
              >
                {idx !== data.length - 1 && (
                  <div className="absolute h-[92px] w-[1px] bg-[#474747] left-[50%] -translate-x-[50%] top-[98%] rounded-full " />
                )}
              </div>
            </div>
            <div className="w-8/12 flex flex-col">
              <span className="text-sm font-medium text-white">{d.text}</span>
              <span className="font-normal text-md text-slate-300">
                {d.description}
              </span>
            </div>
            <div className="w-3/12">
              <span className="bg-[#212125] px-4 py-2 text-sm font-normal text-white rounded-full">
                {d.timeLineDuration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
