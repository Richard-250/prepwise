"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DisplayTechIconsClientProps {
  techIcons: { tech: string; url: string }[];
}

export default function DisplayTechIconsClient({ techIcons }: DisplayTechIconsClientProps) {
  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image src={url} alt={tech} width={100} height={100} className="size-5" />
        </div>
      ))}
    </div>
  );
}
