// lib/actions/feedback.action.ts
"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import {
  //  string,
    z } from "zod";

import { db } from "@/firebase/admin";

// Enhanced feedback schema with more detailed structure
const enhancedFeedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(z.object({
    name: z.string(),
    score: z.number().min(0).max(100),
    comment: z.string(),
    keyPoints: z.array(z.string()).optional(), // Additional key points for each category
    priority: z.enum(['high', 'medium', 'low']).optional() // Priority for improvement
  })),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
  detailedInsights: z.object({
    communicationStyle: z.string().optional(),
    technicalDepth: z.string().optional(),
    problemSolvingApproach: z.string().optional(),
    overallReadiness: z.string().optional()
  }).optional(),
  nextSteps: z.array(z.string()).optional(), // Immediate action items
  industryBenchmark: z.object({
    performanceLevel: z.enum(['below_average', 'average', 'above_average', 'excellent']),
    comparison: z.string()
  }).optional()
});

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: Array<{ role: string; content: string }>;
  feedbackId?: string;
  interviewRole?: string;
  interviewType?: string;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { 
    interviewId, 
    userId, 
    transcript, 
    feedbackId, 
    interviewRole = "Software Developer",
    interviewType = "Technical Interview" 
  } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: enhancedFeedbackSchema,
      prompt: `
        You are an experienced AI interviewer analyzing a mock interview for a ${interviewRole} position. 
        Your task is to provide comprehensive, actionable feedback that will help the candidate improve.

        Interview Type: ${interviewType}
        Role: ${interviewRole}
        
        Transcript:
        ${formattedTranscript}

        EVALUATION CRITERIA:
        Score each category from 0-100 based on industry standards for ${interviewRole} roles:

        1. **Communication Skills** (0-100):
           - Clarity and articulation of thoughts
           - Structured and organized responses
           - Professional language and tone
           - Ability to explain complex concepts simply

        2. **Technical Knowledge** (0-100):
           - Understanding of core concepts for ${interviewRole}
           - Depth of knowledge in relevant technologies
           - Practical application of technical skills
           - Current industry awareness

        3. **Problem-Solving** (0-100):
           - Analytical thinking approach
           - Breaking down complex problems
           - Creative and efficient solutions
           - Logical reasoning process

        4. **Cultural & Role Fit** (0-100):
           - Alignment with professional values
           - Understanding of role requirements
           - Team collaboration mindset
           - Adaptability and learning attitude

        5. **Confidence & Clarity** (0-100):
           - Confidence in responses without arrogance
           - Clear and decisive communication
           - Professional presence and engagement
           - Ability to handle uncertainty gracefully

        SCORING GUIDELINES:
        - 90-100: Exceptional, ready for senior roles
        - 80-89: Strong performance, ready for the role
        - 70-79: Good with minor areas to improve
        - 60-69: Adequate but needs focused improvement
        - 50-59: Below average, significant improvement needed
        - Below 50: Major gaps, extensive preparation required

        REQUIREMENTS:
        - Be honest and constructive, not lenient
        - Provide specific examples from the transcript
        - Focus on actionable improvement areas
        - Compare against industry standards for ${interviewRole}
        - Include detailed insights about their interview style
        - Suggest specific next steps for improvement
        - Benchmark against typical ${interviewRole} candidates
      `,
      system: `You are a professional ${interviewRole} interviewer and career coach with 10+ years of experience. 
               Provide detailed, constructive feedback that helps candidates grow professionally. 
               Be thorough, specific, and actionable in your analysis.`,
    });

    // Enhanced feedback object with additional metadata
    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      detailedInsights: object.detailedInsights,
      nextSteps: object.nextSteps,
      industryBenchmark: object.industryBenchmark,
      metadata: {
        interviewRole,
        interviewType,
        transcriptLength: transcript.length,
        generatedAt: new Date().toISOString(),
        version: '2.0' // Version for future compatibility
      },
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { 
      success: true, 
      feedbackId: feedbackRef.id,
      feedback: feedback // Return feedback data for immediate use
    };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Helper function to analyze feedback trends (optional)
export async function getFeedbackAnalytics(userId: string) {
  try {
    const feedbackCollection = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

type CategoryScore = {
  name: string;
  score: number;
  comment: string;
  keyPoints?: string[];
  priority?: 'high' | 'medium' | 'low';
};

type DetailedInsights = {
  communicationStyle?: string;
  technicalDepth?: string;
  problemSolvingApproach?: string;
  overallReadiness?: string;
};

type IndustryBenchmark = {
  performanceLevel: 'below_average' | 'average' | 'above_average' | 'excellent';
  comparison: string;
};

type Feedback = {
  id: string;
  interviewId: string;
  userId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  detailedInsights?: DetailedInsights;
  nextSteps?: string[];
  industryBenchmark?: IndustryBenchmark;
  metadata?: {
    interviewRole?: string;
    interviewType?: string;
    transcriptLength?: number;
    generatedAt?: string;
    version?: string;
  };
  createdAt?: string;
};

const feedbackData: Feedback[] = feedbackCollection.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
})) as Feedback[];

    // Calculate improvement trends
    const trends = {
      averageScore: feedbackData.reduce((sum, f) => sum + f.totalScore, 0) / feedbackData.length,
      improvementTrend: feedbackData.length > 1 ? 
        feedbackData[0].totalScore - feedbackData[feedbackData.length - 1].totalScore : 0,
      strongestCategory: '', // Calculate based on highest average scores
      weakestCategory: '',   // Calculate based on lowest average scores
    };

    return { success: true, analytics: trends, feedbackHistory: feedbackData };
  } catch (error) {
    console.error("Error fetching feedback analytics:", error);
    return { success: false, error: 'Unable to fetch analytics' };
  }
}
















export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
export async function getInterviewsByUserId(userId: string) {
  const interviewsSnap = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviewsSnap.docs.map(doc => {
    const data = doc.data();

    // Safely handle createdAt
    let createdAt: string = "";
    if (data.createdAt) {
      createdAt = data.createdAt.toDate
        ? data.createdAt.toDate().toISOString() // Firestore Timestamp
        : new Date(data.createdAt).toISOString(); // Date/String fallback
    }

    return {
      id: doc.id,
      ...data,
      role: data.role ?? "",
      type: data.type ?? "", 
      createdAt,
      techstack: Array.isArray(data.techstack)
        ? data.techstack.map(t => String(t))
        : [],
      feedback: data.feedback ?? null,
    };
  });
}
