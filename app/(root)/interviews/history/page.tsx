import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { getTechLogos } from "@/lib/utils";
import InterviewHistoryClient from "@/components/client/InterviewHistory";

export default async function InterviewHistoryPage() {
  const user = await getCurrentUser();
  
  if (!user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-400 mb-8">
            Please log in to view your interview history
          </p>
          <Button asChild className="btn-primary">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch all user interviews
  const userInterviewsRaw = await getInterviewsByUserId(user.id);
  const userInterviews = userInterviewsRaw ?? [];

  // Fetch feedback and tech icons for all interviews
  const userInterviewsWithFeedbackAndIcons = await Promise.all(
    userInterviews.map(async (interview) => {
      try {
        const [feedback, techIcons] = await Promise.all([
          getFeedbackByInterviewId({
            interviewId: interview.id,
            userId: user.id,
          }),
          getTechLogos(interview.techstack ?? []),
        ]);

        return {
          id: interview.id,
          role: interview.role,
          type: interview.type,
          techstack: interview.techstack ?? [],
          createdAt: interview.createdAt,
          feedback: feedback ?? null,
          techIcons, // ✅ processed here
        };
      } catch (error) {
        console.error(`Error fetching data for interview ${interview.id}:`, error);

        return {
          id: interview.id,
          role: interview.role,
          type: interview.type,
          techstack: interview.techstack ?? [],
          createdAt: interview.createdAt,
          feedback: null,
          techIcons: await getTechLogos(interview.techstack ?? []), // still provide icons
        };
      }
    })
  );

  return (
    <InterviewHistoryClient
      initialInterviews={userInterviewsWithFeedbackAndIcons}
      userId={user.id}
    />
  );
}
