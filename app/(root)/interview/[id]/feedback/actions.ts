// app/feedback/[id]/actions.ts
'use server';

import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

interface GenerateTipsParams {
  categoryName: string;
  comment: string;
  score: number;
  interviewRole: string;
  context: any;
}

interface AskQuestionParams {
  question: string;
  feedback: any; 
  interviewRole: string;
  interviewId: string;
}

export async function generateFeedbackTips(params: GenerateTipsParams) {
  const { categoryName, comment, score, interviewRole, context } = params;

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `
        You are a professional career coach providing specific, actionable improvement tips.
        
        Context:
        - Interview Role: ${interviewRole}
        - Category: ${categoryName}
        - Current Score: ${score}/100
        - Feedback Comment: ${comment}
        - Overall Performance: ${context.totalScore}/100
        
        Based on this feedback, provide 4-6 specific, actionable tips for improving in the "${categoryName}" category. 
        Each tip should be:
        1. Specific and actionable
        2. Relevant to the ${interviewRole} role
        3. Address the weaknesses mentioned in the comment
        4. Be practical and implementable
        
        Format your response as a simple list, one tip per line, without numbering or bullet points.
        Focus on concrete steps the candidate can take to improve their score in this area.
      `,
      system: `You are a professional interview coach specializing in ${interviewRole} positions. Provide specific, actionable advice.`
    });

    const tips = text.split('\n')
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0)
      .slice(0, 6);

    return { success: true, tips };
  } catch (error) {
    console.error('Error generating tips:', error);
    return { success: false, tips: ['Unable to generate tips at this time. Please try again later.'] };
  }
}

export async function askFeedbackQuestion(params: AskQuestionParams) {
  const { question, feedback, interviewRole, 
    // interviewId
   } = params;

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `
        You are a professional interview coach answering questions about interview feedback.
        
        Interview Context:
        - Role: ${interviewRole}
        - Overall Score: ${feedback.totalScore}/100
        - Final Assessment: ${feedback.finalAssessment}
        
        Category Breakdown:
        ${feedback.categoryScores?.map((cat: any, idx: number) => 
          `${idx + 1}. ${cat.name}: ${cat.score}/100 - ${cat.comment}`
        ).join('\n')}
        
        Strengths:
        ${feedback.strengths?.map((strength: string,
          //  idx: number
          ) => 
          `- ${strength}`
        ).join('\n')}
        
        Areas for Improvement:
        ${feedback.areasForImprovement?.map((area: string,
          //  idx: number
          ) => 
          `- ${area}`
        ).join('\n')}
        
        User Question: "${question}"
        
        Provide a helpful, specific, and encouraging response to the user's question based on their interview feedback. 
        Be professional, constructive, and provide actionable advice when possible.
        Keep your response concise but informative (2-4 sentences max).
        If the question is about improvement, provide specific next steps.
        If the question is about scoring, explain the reasoning clearly.
      `,
      system: `You are a supportive interview coach helping candidates understand and improve from their interview feedback for ${interviewRole} positions.`
    });

    return { success: true, response: text };
  } catch (error) {
    console.error('Error answering question:', error);
    return { 
      success: false, 
      response: 'I apologize, but I\'m unable to process your question right now. Please try again later or contact support if the issue persists.' 
    };
  }
}