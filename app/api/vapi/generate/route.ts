import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

interface InterviewRequest {
  role: string;
  field: string;
  level: string;
  type: string;
  skills: string;
  techstack?: string; // Keep for backward compatibility
  amount: number;
  userid: string;
  userName?: string;
}

const DIFFICULTY_MAPPING = {
  entry: "entry-level with 0-2 years experience or fresh graduate",
  junior: "junior level with 2-4 years experience",
  mid: "mid-level with 4-8 years experience",
  senior: "senior level with 8+ years experience or leadership responsibilities"
};

const TYPE_DESCRIPTIONS = {
  technical: "focus primarily on job-specific skills, knowledge, and technical competencies",
  behavioral: "focus primarily on soft skills, past experiences, teamwork, leadership, and situational scenarios",
  balanced: "provide an equal mix of job-specific technical questions and behavioral/situational questions"
};

// const COMPANY_SIZE_CONTEXT = {
//   startup: "startup environment with fast-paced, multi-hat wearing culture",
//   small: "small company with close-knit teams and direct impact",
//   medium: "medium-sized company with established processes and growth opportunities",
//   large: "large corporation with structured processes and specialized roles",
//   enterprise: "enterprise-level organization with complex systems and formal procedures"
// };

export async function POST(request: Request) {
  try {
    const {
      role,
      field,
      level,
      type,
      skills,
      techstack, // Backward compatibility
      amount,
      userid,
      userName
    }: InterviewRequest = await request.json();

    // Use skills or fall back to techstack for backward compatibility
    const relevantSkills = skills || techstack;

    // Validation
    if (!role || !level || !type || !relevantSkills || !amount || !userid) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount < 5 || amount > 50) {
      return Response.json(
        { success: false, error: "Amount must be between 5 and 50" },
        { status: 400 }
      );
    }

    // Build enhanced prompt for any profession
    const difficultyLevel = DIFFICULTY_MAPPING[level as keyof typeof DIFFICULTY_MAPPING] || "appropriate level";
    const typeDescription = TYPE_DESCRIPTIONS[type as keyof typeof TYPE_DESCRIPTIONS];

    const prompt = `You are an expert interview coach creating ${amount} professional interview questions for a ${role} position${field ? ` in the ${field} field` : ''}.

CANDIDATE PROFILE:
- Position: ${role}
- Field/Industry: ${field || 'General'}
- Experience Level: ${difficultyLevel}
- Interview Focus: ${typeDescription}
- Key Skills/Knowledge Areas: ${relevantSkills}

INSTRUCTIONS:
1. Create exactly ${amount} questions appropriate for ${level} level candidates
2. ${typeDescription}
3. Questions should be realistic and commonly asked in ${role} interviews
4. Include a variety of question types:
   - Job-specific knowledge and skills
   - Problem-solving scenarios relevant to the role
   - Experience-based questions
   - Situational/behavioral questions (based on focus type)
   - Industry/field-specific challenges if applicable
5. Ensure questions are:
   - Professional and interview-appropriate
   - Clear and easy to understand
   - Relevant to the specific role and field
   - Progressively challenging based on experience level
6. Avoid special characters (/, *, #, etc.) that might break voice synthesis
7. Make questions engaging and realistic for actual interviews

FORMAT REQUIREMENT: Return ONLY a JSON array of questions:
["Question 1 text here", "Question 2 text here", "Question 3 text here"]

Generate diverse, high-quality interview questions now:`;

    console.log("Generating interview with prompt for role:", role, "in field:", field);

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt,
    });

    console.log("Generated questions:", questions);

    // Parse and validate the generated questions
   let parsedQuestions;
try {
  const cleanedQuestions = questions
    .trim()
    .replace(/^```(json)?\s*/i, "") // remove ```json or ```
    .replace(/```$/, "") // remove ending ```
    .trim();

  parsedQuestions = JSON.parse(cleanedQuestions);

  if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
    throw new Error("Invalid questions format");
  }
} catch (parseError) {
  console.error("❌ Failed to parse AI questions output:", parseError, "\nRaw questions:\n", questions);
  return Response.json(
    {
      success: false,
      error: "Failed to parse AI response. Try again or reduce the number of questions.",
    },
    { status: 500 }
  );
}

    // Create interview object
    const interview = {
      role,
      field: field || "General",
      level,
      type,
      skills: relevantSkills.split(",").map((skill: string) => skill.trim()),
      techstack: relevantSkills.split(",").map((skill: string) => skill.trim()), // For backward compatibility
      questions: parsedQuestions,
      userId: userid,
      userName: userName || "User",
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        questionCount: parsedQuestions.length,
        estimatedDuration: Math.ceil(parsedQuestions.length * 3), // 3 minutes per question
        difficulty: level,
        tags: [role, field, level, type].filter(Boolean),
      }
    };

    // Save to Firebase
    const docRef = await db.collection("interviews").add(interview);
    console.log("Interview saved with ID:", docRef.id);

    return Response.json({
      success: true,
      interviewId: docRef.id,
      questionCount: parsedQuestions.length,
      message: "Interview questions generated successfully!"
    }, { status: 200 });

  } catch (error) {
    console.error("Error generating interview:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: "Universal Interview Generation API",
    description: "Generate interview questions for any profession or field",
    endpoints: {
      POST: "Generate new interview questions for any role",
      supportedLevels: Object.keys(DIFFICULTY_MAPPING),
      supportedTypes: Object.keys(TYPE_DESCRIPTIONS),
      supportedFields: "Any profession or industry"
    }
  }, { status: 200 });
}