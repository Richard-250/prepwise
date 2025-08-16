import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews } from "@/lib/actions/general.action";
import { getTechLogos } from "@/lib/utils";
import PracticalInterviewHistoryClient from "@/components/client/PracticeInterviews";

export default async function PracticalInterviewHistoryPage() {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400 mb-8">
            Please log in to view practical interviews
          </p>
          <Button asChild className="btn-primary">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch latest interviews (not user-specific) - FIXED: Pass required parameters
  const latestInterviewsRaw = await getLatestInterviews({
    userId: user.id, // Required: to exclude current user's interviews
    limit: 20       // Optional: defaults to 20 if not specified
  });
  
  const latestInterviews = latestInterviewsRaw ?? [];

  // Process interviews with tech icons (no feedback needed)
  const processedInterviews = await Promise.all(
    latestInterviews.map(async (interview) => {
      try {
        const techIcons = await getTechLogos(interview.techstack ?? []);
        return {
          id: interview.id,
          role: interview.role,
          type: interview.type,
          techstack: interview.techstack ?? [],
          createdAt: interview.createdAt,
          techIcons,
        };
      } catch (error) {
        console.error(`Error processing interview ${interview.id}:`, error);
        return {
          id: interview.id,
          role: interview.role,
          type: interview.type,
          techstack: interview.techstack ?? [],
          createdAt: interview.createdAt,
          techIcons: await getTechLogos(interview.techstack ?? []),
        };
      }
    })
  );

  return (
    <PracticalInterviewHistoryClient
      initialInterviews={processedInterviews}
      userId={user.id}
    />
  );
}