'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  // Dialog,
  // DialogContent,
  // DialogDescription,
  // DialogHeader,
  // DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
import {
  // HelpCircle,
  MessageCircle,
  TrendingUp,
  Target,
  BookOpen,
  Send,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { generateFeedbackTips, askFeedbackQuestion } from './actions';

interface FeedbackClientProps {
  feedback: any;
  interviewId: string;
  interviewRole: string;
}

const FeedbackClient: React.FC<FeedbackClientProps> = ({ 
  feedback, 
  interviewId, 
  interviewRole 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tips, setTips] = useState<{ [key: string]: string[] }>({});
  const [loadingTips, setLoadingTips] = useState<{ [key: string]: boolean }>({});
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, question: string, answer: string}>>([]);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleGetTips = async (categoryName: string, comment: string, score: number) => {
    if (tips[categoryName]) return; // Already loaded
    
    setLoadingTips(prev => ({ ...prev, [categoryName]: true }));
    try {
      const generatedTips = await generateFeedbackTips({
        categoryName,
        comment,
        score,
        interviewRole,
        context: feedback
      });
      setTips(prev => ({ ...prev, [categoryName]: generatedTips.tips }));
    } catch (error) {
      console.error('Error generating tips:', error);
    } finally {
      setLoadingTips(prev => ({ ...prev, [categoryName]: false }));
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    setLoadingAnswer(true);
    try {
      const answer = await askFeedbackQuestion({
        question,
        feedback,
        interviewRole,
        interviewId
      });
      
      const newChat = {
        id: Date.now().toString(),
        question,
        answer: answer.response
      };
      
      setChatHistory(prev => [...prev, newChat]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-8">
      {/* Final Assessment Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Overall Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-primary-200 leading-relaxed">{feedback?.finalAssessment}</p>
        </CardContent>
      </Card>

      {/* Interactive Category Breakdown */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Detailed Breakdown
        </h2>
        
        <div className="grid gap-4">
          {feedback?.categoryScores?.map((category: any, index: number) => (
            <Card 
              key={index} 
              className="group hover:shadow-lg transition-all duration-300 border-l-4"
              style={{ borderLeftColor: category.score >= 80 ? '#16a34a' : category.score >= 60 ? '#ca8a04' : '#dc2626' }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getScoreIcon(category.score)}
                    <h3 className="text-lg font-semibold">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                      {category.score}/100
                    </span>
                    
                    {/* Tips Tooltip */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => handleGetTips(category.name, category.comment, category.score)}
                            disabled={loadingTips[category.name]}
                          >
                            <Lightbulb className="w-4 h-4 text-amber-500 cursor-pointer" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-amber-700'>Get improvement tips</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <p className="text-primary-200 mb-4">{category.comment}</p>
                
                {/* Tips Section */}
                {tips[category.name] && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Improvement Tips:
                    </h4>
                    <ul className="space-y-1">
                      {tips[category.name].map((tip: string, tipIndex: number) => (
                        <li key={tipIndex} className="text-blue-700 text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {loadingTips[category.name] && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Generating personalized tips...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Strengths Section */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="w-5 h-5" />
            Your Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback?.strengths?.map((strength: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-gray-500">{strength}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Areas for Improvement Section */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Target className="w-5 h-5" />
            Areas for Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback?.areasForImprovement?.map((area: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Target className="w-4 h-4 text-orange-500 mt-0.5" />
                <span className="text-gray-500">{area}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Interactive Q&A Section */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <MessageCircle className="w-5 h-5" />
            Ask About Your Feedback
          </CardTitle>
          <p className="text-sm text-gray-400">
            Have questions about your performance? Ask anything about your interview feedback!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="space-y-2">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-blue-500">Q: {chat.question}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{chat.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Question Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your interview performance..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
              className="flex-1"
            />
            <Button 
              onClick={handleAskQuestion} 
              disabled={!question.trim() || loadingAnswer}
              size="sm"
              className='cursor-pointer'
            >
              {loadingAnswer ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            <p className="text-sm text-primary-200 w-full">Quick questions:</p>
            {[
              "How can I improve my technical skills?",
              "What should I focus on for next time?",
              "Can you explain my lowest score?",
              "What are the industry standards for this role?"
            ].map((quickQ, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setQuestion(quickQ)}
                className="text-xs cursor-pointer"
              >
                {quickQ}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackClient;