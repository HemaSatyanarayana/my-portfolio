import HeaderComponent from "./components/HeaderComponent";
import Introduction from "./components/Introduction";
import Experience from "./components/Experience";
import ProjectsAndAwards from "./components/ProjectsAndAwards";
import data from "./data/profile.json";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <ScrollArea className="h-[100vh]">
      <div className="bg-[#0D0D0F] flex flex-col px-52 py-12 gap-2">
        {/* Header */}

        <HeaderComponent />

        {/* Introduction */}

        <Introduction name={data.name} role={data.role} />

        {/* Experience */}

        <Experience
          totalExperience={data.totalExperienceInYears}
          experiences={data.experiences}
        />

        {/* Projects and Awards*/}

        <ProjectsAndAwards />
      </div>
    </ScrollArea>
  );
}
