// DisplayTechIcons.tsx (Server Component)
import DisplayTechIconsClient from "@/components/client/DisplayTechIconsClient";
import { getTechLogos } from "@/lib/utils";

interface TechIconProps {
  techStack: string[];
}

export default async function DisplayTechIcons({ techStack }: TechIconProps) {
  // Fetch tech icons on the server
  const techIcons: { tech: string; url: string }[] = await getTechLogos(techStack);

  // Pass data to the client component
  return <DisplayTechIconsClient techIcons={techIcons} />;
}
