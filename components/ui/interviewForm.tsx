"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


interface InterviewFormProps {
  userId: string;
  userName: string;
  profileImage: string;
}

interface FormData {
  role: string;
  field: string;
  level: string;
  type: string;
  skills: string;
  amount: number;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ userId, userName }) => {
  const [formData, setFormData] = useState<FormData>({
    role: "",
    field: "",
    level: "entry",
    type: "balanced",
    skills: "",
    amount: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);


  const experienceLevels = [
    { value: "entry", label: "Entry Level", description: "0-2 years experience or fresh graduate" },
    { value: "junior", label: "Junior Level", description: "2-4 years experience" },
    { value: "mid", label: "Mid Level", description: "4-8 years experience" },
    { value: "senior", label: "Senior Level", description: "8+ years experience or leadership role" }
  ];

  const interviewTypes = [
    { value: "technical", label: "Technical Focus", description: "Job-specific skills and knowledge questions" },
    { value: "behavioral", label: "Behavioral Focus", description: "Soft skills, teamwork, and situational questions" },
    { value: "balanced", label: "Balanced Mix", description: "Mix of technical and behavioral questions" }
  ];

  const popularFields = [
    "Software Development", "Data Science", "Marketing", "Sales", "Finance", 
    "Human Resources", "Healthcare", "Education", "Engineering", "Design",
    "Customer Service", "Operations", "Consulting", "Legal", "Research",
    "Project Management", "Business Analysis", "Quality Assurance", "Other"
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" ? parseInt(value) : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.role.trim()) {
      toast.error("Please enter a job role");
      return false;
    }
    if (!formData.field.trim()) {
      toast.error("Please select or enter your field");
      return false;
    }
    if (!formData.skills.trim()) {
      toast.error("Please enter relevant skills or knowledge areas");
      return false;
    }
    if (formData.amount < 5 || formData.amount > 50) {
      toast.error("Number of questions must be between 5 and 50");
      return false;
    }
    return true;
  };
 const router = useRouter(); // Add this line at the top of the component

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("/api/vapi/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        userid: userId,
        userName: userName,
        techstack: formData.skills
      }),
    });

    const result = await response.json();

    if (result.success) {
      toast.success("Interview questions generated successfully!");
      // Redirect to interviews page
      router.push("/interviews");
    } else {
      toast.error("Failed to generate interview questions. Please try again.");
    }
  } catch (error) {
    console.error("Error generating interview:", error);
    toast.error("An error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="max-w-2xl mx-auto ">
      <form onSubmit={handleSubmit} className=" form space-y-6 text-gray-200">
        {/* Job Role */}
        <div className="space-y-2">
          <label htmlFor="role" className="label">
            Job Role / Position *
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g., Marketing Manager, Software Engineer, Nurse, Teacher, Sales Representative"
            className="w-full px-4 py-3 border border-amber-300/20 rounded-lg focus:ring-2 focus:ring-amber-300 "
            required
          />
        </div>

        {/* Field/Industry */}
        <div className="space-y-2">
          <label htmlFor="field" className="label">
            Field / Industry *
          </label>
          <div className="space-y-2">
            <select
              id="field"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-amber-300/20 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Select your field</option>
              {popularFields.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Don't see your field? Select "Other" and specify in the skills section below.
            </p>
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-4">
          <label className="label">
            Experience Level *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {experienceLevels.map((level) => (
              <label key={level.value} className="relative cursor-pointer label">
                <input
                  type="radio"
                  name="level"
                  value={level.value}
                  checked={formData.level === level.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg transition-all ${
                  formData.level === level.value
                    ? "border-b-amber-300 bg-amber-100/10"
                    : "border-gray-300/20 hover:border-amber-300"
                }`}>
                  <div className="font-medium text-primary-200 text-sm">{level.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-primary-200">
            Interview Focus *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {interviewTypes.map((type) => (
              <label key={type.value} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value={type.value}
                  checked={formData.type === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-3 border-2 rounded-lg transition-all ${
                  formData.type === type.value
                    ? "border-b-amber-300 bg-amber-200/10"
                    : "border-gray-200/20 hover:border-amber-300"
                }`}>
                  <div className="font-medium text-primary-200 text-sm">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Skills/Knowledge Areas */}
        <div className="space-y-2">
          <label htmlFor="skills" className="block text-sm font-semibold text-primary-200">
            Key Skills / Knowledge Areas *
          </label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="e.g., Customer relationship management, Problem solving, Microsoft Excel, Budget planning, Team leadership, Communication skills, Data analysis"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300/20 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
            required
          />
          <p className="text-sm text-gray-400">
            List the main skills, tools, knowledge areas, or qualifications relevant to this role. Separate with commas.
          </p>
        </div>

        {/* Number of Questions */}
        <div className="space-y-3">
          <label htmlFor="amount" className="block text-sm font-semibold text-primary-200">
            Number of Interview Questions
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">5</span>
            <input
              type="range"
              id="amount"
              name="amount"
              min="5"
              max="50"
              value={formData.amount}
              onChange={handleInputChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-400">50</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold text-amber-300">{formData.amount} questions</span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            Recommended: 15-20 questions for comprehensive preparation
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600/10 hover:bg-amber-300/10 focus:ring-4 focus:ring-blue-200"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Your Interview Questions...</span>
              </div>
            ) : (
              "Generate Interview Questions"
            )}
          </button>
        </div>

        {/* Help Text */}
        <div className="bg-white/20 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-primary-200 mb-2">💡 Tips for Better Results:</h3>
          <ul className="text-sm text-gray-900 space-y-1">
            <li>• Be specific about your role (e.g., "Elementary School Teacher" vs just "Teacher")</li>
            <li>• Include both hard skills (tools, software) and soft skills (communication, leadership)</li>
            <li>• Mention any certifications or specific qualifications if relevant</li>
            <li>• Choose the right experience level to get appropriately challenging questions</li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default InterviewForm;