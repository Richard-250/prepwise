import { Button } from "@/components/ui/button";

function ContactPage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-700">
          Get in <span className="text-primary-200">Touch</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
          We&apos;d love to hear from you. Send us a message and we&apos;ll respond as
          soon as possible.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <section className=" card rounded-2xl shadow-sm border border-gray-200/20 p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary-200 mb-2">
                Send us a message
              </h2>
              <p className="text-gray-500">
                Fill out the form below and we&apos;ll get back to you within 24
                hours.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-500 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-500 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent outline-none transition-colors"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 border  border-gray-300/20 rounded-lg focus:ring-2 focus:ring-primary-100/10 focus:border-transparent outline-none transition-colors"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-500 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-transparent outline-none transition-colors resize-vertical"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary btn-animated text-lg py-3"
              >
                <span className="flex items-center">
                  Send Message
                  <svg
                    className="ml-2 w-5 h-5 transform rotate-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </span>
              </Button>
            </form>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-8">
          {/* Contact Cards */}
          <div className="space-y-6">
            <ContactCard
              icon="📧"
              title="Email Us"
              description="Send us an email anytime"
              details="support@prepwise.com"
              action="mailto:support@prepwise.com"
            />

            <ContactCard
              icon="💬"
              title="Live Chat"
              description="Chat with our support team"
              details="Available 24/7"
              action="#"
            />

            <ContactCard
              icon="📞"
              title="Call Us"
              description="Speak directly with our team"
              details="+1 (555) 123-4567"
              action="tel:+15551234567"
            />
          </div>

          {/* FAQ Section */}
          <div className=" rounded-2xl p-8">
            <h3 className="text-xl font-bold text-primary-100 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <FAQItem
                question="How does the AI interviewer work?"
                answer="Our AI uses advanced natural language processing to conduct realistic interviews and provide personalized feedback."
              />
              <FAQItem
                question="Is my data secure?"
                answer="Yes, we use enterprise-grade security measures to protect all user data and interview sessions."
              />
              <FAQItem
                question="Can I practice for specific companies?"
                answer="Absolutely! Our platform includes company-specific interview formats and question types."
              />
            </div>
          </div>

          {/* Response Time */}
          <div className=" rounded-xl shadow-sm border border-gray-200/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-primary-200">
                  Quick Response
                </h4>
                <p className="text-gray-600">
                  We typically respond within 2-4 hours during business days
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Office Information */}
      <section className="bg-white/10 rounded-2xl shadow-sm border border-gray-200/20 p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-primary-200 mb-4">
              Visit Our Office
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-100 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-400">Address</p>
                  <p className="text-gray-600">
                    Kigali,Rusororo
                    <br />
                    Kabuga,KN 3rd
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-100 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-400">Office Hours</p>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM PST
                    <br />
                    Weekend: By appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-200/10 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-gray-500">Interactive Map</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Contact Card Component
const ContactCard = ({
  icon,
  title,
  description,
  details,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  details: string;
  action: string;
}) => (
  <div className="bg-white/10 rounded-xl shadow-sm border border-gray-200/20 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-4">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <h3 className="font-semibold text-primary-200 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-2">{description}</p>
        <a
          href={action}
          className="text-amber-300  hover:text-amber-200 underline font-medium text-sm transition-colors"
        >
          {details}
        </a>
      </div>
    </div>
  </div>
);

// FAQ Item Component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => (
  <div className="border-b border-amber-300 pb-4 last:border-b-0 last:pb-0">
    <h4 className="font-medium text-primary-200 mb-2">{question}</h4>
    <p className="text-gray-500 text-sm">{answer}</p>
  </div>
);

export default ContactPage;
