import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

async function Home() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          Please log in to access PrepWise
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50/10 to-indigo-100/10 rounded-2xl overflow-hidden">
        <div className="px-8 py-16 lg:px-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-primary-100 leading-tight">
                Get Interview-Ready with{" "}
                <span className="text-gray-700">AI-Powered</span> Practice &
                Feedback
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Practice real interview questions, get instant feedback, and
                boost your confidence with our advanced AI interviewer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="btn-primary btn-animated text-lg px-8 py-3"
                >
                  <Link href="/interview">
                    <span>Start Your First Interview</span>
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="text-lg px-8 py-3 hover:text-gray-900"
                >
                  <Link href="/interviews">View All Interviews</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/robot.png"
                alt="AI Interview Assistant"
                width={500}
                height={500}
                className="w-full max-w-md mx-auto"
                priority
              />
              {/* Floating elements for visual appeal */}
              <div className="absolute top-4 right-4 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-900 font-medium">
                    AI Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary-100">
            Why Choose PrepWise?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive interview preparation
            tailored to your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="🎯"
            title="Personalized Practice"
            description="Get questions tailored to your role, experience level, and target companies"
          />
          <FeatureCard
            icon="🤖"
            title="Real-time AI Feedback"
            description="Receive instant feedback on your answers, body language, and speaking pace"
          />
          <FeatureCard
            icon="📊"
            title="Progress Tracking"
            description="Monitor your improvement with detailed analytics and performance insights"
          />
          <FeatureCard
            icon="🎤"
            title="Voice Practice"
            description="Practice with our advanced voice AI that simulates real interview conversations"
          />
          <FeatureCard
            icon="💼"
            title="Industry Specific"
            description="Prepare for technical, behavioral, and role-specific interview scenarios"
          />
          <FeatureCard
            icon="⚡"
            title="Instant Results"
            description="Get immediate scoring and actionable recommendations after each session"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-100/10 text-primary-100 rounded-2xl p-8 lg:p-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-500 opacity-90">
            Join thousands of professionals who have improved their interview
            skills with PrepWise
          </p>
          <Button
            asChild
            className="btn-primary btn-animated  text-lg px-8 py-3"
          >
           <Link href="/interviews"><span>Get Started Now</span></Link>
          </Button>
        </div>
      </section>

      {/* Welcome Message */}
      <section className="bg-white/10 rounded-xl shadow-sm border border-white/20 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100/10 rounded-full flex items-center justify-center">
            <span className="text-amber-300 font-semibold text-lg">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-200">
              Welcome back, {user.name || "User"}!
            </h3>
            <p className="text-gray-600">
              Ready to continue your interview preparation journey?
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className="text-gray-600 rounded-xl p-6 shadow-sm border border-white/20 hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-primary-200 mb-2">{title}</h3>
    <p className="text-gray-500">{description}</p>
  </div>
);

export default Home;
