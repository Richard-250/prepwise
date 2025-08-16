"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { ArrowLeft, Search, Calendar, Award } from "lucide-react";

interface Feedback {
  totalScore: number;
}

interface Interview {
  id: string;
  role: string;
  type: string;
  techstack: string[];
 techIcons: { tech: string; url: string }[];
  createdAt: string;
  feedback?: Feedback | null;
}

interface InterviewHistoryClientProps {
  initialInterviews: Interview[];
  userId: string;
  
}

export default function InterviewHistoryClient({
  initialInterviews,
  userId
}: InterviewHistoryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter + sort
  const filteredInterviews = initialInterviews
    .filter((interview) => {
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        interview.role.toLowerCase().includes(term) ||
        interview.type.toLowerCase().includes(term) ||
        interview.techstack.some((t) => t.toLowerCase().includes(term));

      const matchesFilter =
        filterType === "all" ||
        interview.type.toLowerCase() === filterType.toLowerCase();

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() -
            new Date(b.createdAt).getTime()
          );
        case "highest-score":
          return (
            (b.feedback?.totalScore || 0) -
            (a.feedback?.totalScore || 0)
          );
        case "lowest-score":
          return (
            (a.feedback?.totalScore || 0) -
            (b.feedback?.totalScore || 0)
          );
        default:
          return 0;
      }
    });

  const interviewTypes = [
    ...new Set(initialInterviews.map((i) => i.type))
  ];

  // Stats
  const totalInterviews = initialInterviews.length;
  const completedWithFeedback = initialInterviews.filter(
    (i) => i.feedback?.totalScore
  ).length;
  const averageScore =
    completedWithFeedback > 0
      ? Math.round(
          initialInterviews.reduce(
            (sum, i) => sum + (i.feedback?.totalScore || 0),
            0
          ) / completedWithFeedback
        )
      : 0;

  const clearSearch = () => {
    setSearchTerm("");
    setFilterType("all");
    setSortBy("newest");
  };

  const hasActiveFilters = searchTerm !== "" || filterType !== "all";

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Link href="/interviews" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Interviews
            </Link>
          </Button>
        </div>

        {/* Page Title */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Interview History</h1>
            <p className="text-gray-400 text-lg">
              Complete history of your interview sessions with detailed feedback
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-2xl p-6 shadow-xl border border-gray-200/20">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-primary-100">{totalInterviews}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Sessions</h3>
            <p className="text-sm text-gray-400">All completed interviews</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 shadow-xl border border-gray-200/20">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-6 h-6 text-green-400" />
              <span className="text-2xl font-bold text-primary-100">{completedWithFeedback}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">With Feedback</h3>
            <p className="text-sm text-gray-400">Sessions with scores</p>
          </div>

          <div className="bg-white/10 rounded-2xl p-6 shadow-xl border border-gray-200/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">⭐</span>
              <span className="text-2xl font-bold text-primary-100">{averageScore}%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Average Score</h3>
            <p className="text-sm text-gray-400">Overall performance</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white/10 rounded-2xl p-6 shadow-xl border border-gray-200/20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by role, type, or tech stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="all">All Types</option>
                {interviewTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-gray-600 rounded-lg px-4 py-3 text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-score">Highest Score</option>
                <option value="lowest-score">Lowest Score</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>Active filters:</span>
                {searchTerm && (
                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Search: `${searchTerm}`
                  </span>
                )}
                {filterType !== "all" && (
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Type: {filterType}
                  </span>
                )}
              </div>
              <Button
                onClick={clearSearch}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white/10 rounded-2xl shadow-xl border border-gray-200/20 overflow-hidden">
          {filteredInterviews.length > 0 ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {filteredInterviews.length === totalInterviews
                    ? `All ${totalInterviews} Interview${totalInterviews !== 1 ? "s" : ""}`
                    : `${filteredInterviews.length} of ${totalInterviews} Interview${totalInterviews !== 1 ? "s" : ""}`}
                </h3>
                {hasActiveFilters && (
                  <Button
                    onClick={clearSearch}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    Show All ({totalInterviews})
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredInterviews.map((interview) => (
                  <div key={interview.id} className="flex justify-center">
                    <InterviewCard
                key={interview.id}
                userId={userId}
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
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                {hasActiveFilters ? "No interviews found" : "No interviews yet"}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {hasActiveFilters
                  ? "No interviews match your search criteria. Try adjusting your filters."
                  : "Start your first interview to begin building your history"}
              </p>
              {hasActiveFilters ? (
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  className="text-gray-300 border-gray-600 hover:bg-white/5"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button asChild className="btn-primary shadow-lg">
                  <Link href="/interview">Take Your First Interview</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
