import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function AboutPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-700">
          About <span className="text-primary-200">PrepWise</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
          We&apos;re revolutionizing interview preparation with AI-powered practice sessions 
          that help professionals land their dream jobs with confidence.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-primary-200">Our Mission</h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            At PrepWise, we believe that everyone deserves the opportunity to showcase their best self 
            in interviews. Our mission is to democratize interview preparation by providing accessible, 
            AI-powered tools that help candidates practice, improve, and succeed.
          </p>
          <p className="text-lg text-gray-500 leading-relaxed">
            We understand that interviews can be nerve-wracking, and the traditional methods of 
            preparation often fall short. That&apos;s why we&apos;ve built an intelligent platform that 
            simulates real interview scenarios and provides personalized feedback to help you grow.
          </p>
        </div>
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100/10 to-indigo-200 rounded-2xl p-8">
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={400}
              height={400}
              className="w-full max-w-sm mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary-200">Our Values</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ValueCard
            icon="🎯"
            title="Excellence"
            description="We strive for excellence in every aspect of our platform, from AI accuracy to user experience."
          />
          <ValueCard
            icon="🤝"
            title="Accessibility"
            description="Quality interview preparation should be available to everyone, regardless of background or resources."
          />
          <ValueCard
            icon="🚀"
            title="Innovation"
            description="We continuously push the boundaries of what's possible with AI and machine learning technologies."
          />
          <ValueCard
            icon="💡"
            title="Empowerment"
            description="We empower individuals to take control of their career journey and achieve their professional goals."
          />
          <ValueCard
            icon="🌟"
            title="Growth"
            description="We believe in continuous learning and improvement, both for our users and our platform."
          />
          <ValueCard
            icon="🔒"
            title="Trust"
            description="We maintain the highest standards of privacy and security to protect our users' data and progress."
          />
        </div>
      </section>

      {/* Technology Section */}
      <section className=" rounded-2xl p-8 lg:p-12 border border-gray-200/20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-primary-100">Powered by Advanced AI</h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Our platform leverages cutting-edge artificial intelligence and natural language 
              processing to create realistic interview experiences. Our AI interviewer adapts 
              to your responses, asks follow-up questions, and provides detailed feedback on 
              your performance.
            </p>
            <div className="space-y-4">
              <TechFeature title="Natural Language Processing" description="Understanding context and nuance in your responses" />
              <TechFeature title="Voice Recognition" description="Analyzing speech patterns, pace, and clarity" />
              <TechFeature title="Behavioral Analysis" description="Providing insights on communication skills" />
              <TechFeature title="Adaptive Learning" description="Personalizing questions based on your progress" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50/10 to-blue-50 rounded-xl p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100/10 rounded-full flex items-center justify-center">
                  <span className="text-amber-300 font-bold">AI</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Smart Interview Engine</h4>
                  <p className="text-sm text-">Advanced algorithms power every interaction</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-b-amber-200 border rounded-lg p-4 shadow-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">Question Relevance</span>
                    <span className="text-sm text-gray-900">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="border-b-amber-200 border  rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-800">Response Accuracy</span>
                    <span className="text-sm text-gray-900">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-900 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary-200">Built by Experts</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our team combines deep expertise in AI, HR, and career development
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TeamMember
            name="Sarah Chen"
            role="CEO & Co-founder"
            description="Former FAANG recruiter with 10+ years in talent acquisition"
            image="/team/sarah.jpg"
          />
          <TeamMember
            name="David Rodriguez"
            role="CTO & Co-founder"
            description="AI researcher specializing in natural language processing"
            image="/team/david.jpg"
          />
          <TeamMember
            name="Emily Johnson"
            role="Head of Product"
            description="UX expert focused on creating intuitive learning experiences"
            image="/team/emily.jpg"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className=" text-primary-200 rounded-2xl p-8 lg:p-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Transform Your Interview Skills?
          </h2>
          <p className="text-xl opacity-90 text-gray-500">
            Join thousands of professionals who have already improved their interview performance with PrepWise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="btn-animated btn-primary">
              <Link href="/interviews">
             <span> Start Practicing Today</span>  
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary-100 text-lg px-8 py-3">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Value Card Component
const ValueCard = ({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) => (
  <div className=" rounded-xl p-6 shadow-sm border border-gray-200/20 hover:shadow-md transition-shadow">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-primary-200 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </div>
);

// Tech Feature Component
const TechFeature = ({ title, description }: {
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="w-2 h-2 bg-primary-100 rounded-full mt-2 flex-shrink-0"></div>
    <div>
      <h4 className="font-medium text-primary-200">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

// Team Member Component
const TeamMember = ({ name, role, description }: {
  name: string;
  role: string;
  description: string;
  image: string;
}) => (
  <div className="bg-white/10 rounded-xl p-6 shadow-sm border border-gray-200 text-center">
    <div className="w-20 h-20 bg-gray-200/10 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-2xl font-semibold text-amber-300">
        {name.split(' ').map(n => n[0]).join('')}
      </span>
    </div>
    <h3 className="text-lg font-semibold text-primary-100 mb-1">{name}</h3>
    <p className="text-primary-200 font-medium mb-3">{role}</p>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

export default AboutPage;