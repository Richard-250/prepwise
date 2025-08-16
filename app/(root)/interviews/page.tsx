import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { getTechLogos } from "@/lib/utils";

async function InterviewsPage() {
  const user = await getCurrentUser();
  
  if (!user || !user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-8">Please log in to view and manage your interviews</p>
          <Button asChild className="btn-primary">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [userInterviewsRaw, allInterviewRaw] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
  ]);

  const userInterviews = userInterviewsRaw ?? [];
  const allInterview = allInterviewRaw ?? [];

  // Fetch feedback and tech icons for user interviews in batch
  const userInterviewsWithFeedbackAndIcons = await Promise.all(
    userInterviews.slice(0, 6).map(async (interview) => {
      const [feedback, techIcons] = await Promise.all([
        getFeedbackByInterviewId({ 
          interviewId: interview.id, 
          userId: user.id 
        }),
        getTechLogos(interview.techstack)
      ]);
      return {
        ...interview,
        feedback,
        techIcons
      };
    })
  );

  // Fetch tech icons for available practice interviews
  const allInterviewWithIcons = await Promise.all(
    allInterview.slice(0, 6).map(async (interview) => {
      const techIcons = await getTechLogos(interview.techstack);
      return {
        ...interview,
        techIcons
      };
    })
  );

  // Calculate success rate based on actual feedback scores
  const calculateSuccessRate = () => {
    if (userInterviewsWithFeedbackAndIcons.length === 0) return "0";
    
    let totalScore = 0;
    let completedInterviews = 0;
    
    for (const interview of userInterviewsWithFeedbackAndIcons) {
      if (interview.feedback?.totalScore) {
        totalScore += interview.feedback.totalScore;
        completedInterviews++;
      }
    }
    
    return completedInterviews > 0 ? Math.round(totalScore / completedInterviews) : "0";
  };

  const successRate = calculateSuccessRate();
  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview.length > 0;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Interviews</h1>
            <p className="text-gray-400 text-lg">
              Manage your interview practice sessions and track your progress
            </p>
          </div>
          <Button asChild className="btn-primary btn-animated w-fit shadow-lg">
            <Link href="/interview">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start New Interview
              </span> 
            </Link>
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Interviews"
            value={userInterviews.length}
            icon="📊"
            description="Completed sessions"
          />
          <StatCard
            title="Available Practice"
            value={allInterview.length}
            icon="🎯"
            description="Ready to take"
          />
          <StatCard
            title="Success Rate"
            value={`${successRate}%`}
            icon="⭐"
            description="Average score"
          />
        </div>

        {/* Your Past Interviews Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Interview History</h2>
              <p className="text-gray-400 mt-1">Your completed interview sessions</p>
            </div>
            {hasPastInterviews && (
              <Button asChild variant="outline" className="text-gray-300 border-gray-600 hover:bg-white/5">
                <Link href="/interviews/history" className="flex items-center gap-2">
                  View All History
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-white/10 rounded-2xl shadow-xl border border-gray-200/20 backdrop-blur-sm overflow-hidden">
            {hasPastInterviews ? (
              <div className="p-8">
                {/* Horizontal Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {userInterviewsWithFeedbackAndIcons.map((interview) => (
                    <div key={interview.id} className="flex justify-center">
                      <InterviewCard
                        userId={user?.id}
                        interviewId={interview.id}
                        role={interview.role}
                        type={interview.type}
                        techstack={interview.techstack}
                        techIcons={interview.techIcons} 
                        createdAt={interview.createdAt}
                        feedback={interview.feedback}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Show more button if there are more than 6 interviews */}
                {userInterviews.length > 6 && (
                  <div className="flex justify-center mt-10">
                    <Button asChild variant="outline" size="lg" className="text-gray-300 border-gray-600 hover:bg-white/5">
                      <Link href="/interviews/history" className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View All {userInterviews.length} Interviews
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No interviews yet</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Start your first interview to begin tracking your progress and building your interview history</p>
                <Button asChild className="btn-primary shadow-lg">
                  <Link href="/interview">
                    Take Your First Interview
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Available Interviews Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Practice Interviews</h2>
              <p className="text-gray-400 mt-1">Available sessions ready for practice</p>
            </div>
            {hasUpcomingInterviews && (
              <Button asChild variant="outline" className="text-gray-300 border-gray-600 hover:bg-white/5">
                <Link href="/interviews/practice" className="flex items-center gap-2">
                  View All Practice
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </Button>
            )}
          </div>

          <div className="bg-white/10 rounded-2xl shadow-xl border border-gray-200/20 backdrop-blur-sm overflow-hidden">
            {hasUpcomingInterviews ? (
              <div className="p-8">
                {/* Horizontal Card Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allInterviewWithIcons.map((interview) => (
                    <div key={interview.id} className="flex justify-center">
                      <InterviewCard
                        userId={user?.id}
                        interviewId={interview.id}
                        role={interview.role}
                        type={interview.type}
                        techstack={interview.techstack}
                        techIcons={interview.techIcons}
                        createdAt={interview.createdAt}
                        feedback={null} // Practice interviews don't have feedback until taken
                      />
                    </div>
                  ))}
                </div>
                
                {/* Show more button if there are more than 6 interviews */}
                {allInterview.length > 6 && (
                  <div className="flex justify-center mt-10">
                    <Button asChild variant="outline" size="lg" className="text-gray-300 border-gray-600 hover:bg-white/5">
                      <Link href="/interviews/practice" className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View All {allInterview.length} Practice Interviews
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-gray-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No practice interviews available</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Check back later for new practice opportunities or create your own custom interview session</p>
                <Button asChild className="btn-primary shadow-lg">
                  <Link href="/interview">
                    Create Custom Interview
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Statistics Card Component
const StatCard = ({ title, value, icon, description }: {
  title: string;
  value: string | number;
  icon: string;
  description: string;
}) => (
  <div className="bg-white/10 rounded-2xl p-8 shadow-xl border border-gray-200/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
    <div className="flex items-center justify-between mb-4">
      <span className="text-3xl">{icon}</span>
      <span className="text-3xl font-bold text-primary-100">{value}</span>
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

export default InterviewsPage;