import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewForm from "@/components/ui/interviewForm";

const Page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to generate your personalized interview.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-200 mb-2">
              AI Interview Generator
            </h1>
            <p className="text-lg text-gray-500">
              Create personalized interview questions tailored to your career goals
            </p>
          </div>
          
          <InterviewForm 
            userId={user.id}
            userName={user.name}
            profileImage={user.profileURL}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;