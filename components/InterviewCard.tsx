"use client";

import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DisplayTechIconsClient from "@/components/client/DisplayTechIconsClient";
import { cn, getRandomInterviewCover } from "@/lib/utils";

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  techIcons: { tech: string; url: string }[]; // Add this prop for resolved tech icons
  createdAt: string;
  feedback?: {
    totalScore?: number;
    finalAssessment?: string;
    createdAt?: string;
  } | null;
}

export default function InterviewCard({
  interviewId,
  role,
  type,
  // techstack,
  techIcons, // Accept the resolved tech icons
  createdAt,
  feedback,
}: InterviewCardProps) {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-full max-w-[360px] min-h-96 hover:transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
      <div className="card-interview">
        <div className="flex-1">
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg text-xs font-semibold",
              badgeColor
            )}
          >
            <p className="badge-text">{normalizedType}</p>
          </div>

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-cover size-[90px] ring-2 ring-white/20"
            />
          </div>

          {/* Role */}
          <h3 className="text-xl font-bold text-center capitalize text-white mb-4">
            {role} Interview
          </h3>

          {/* Date & Score */}
          <div className="flex flex-row justify-center gap-6 mb-4">
            <div className="flex flex-row items-center gap-2">
              <Image src="/calendar.svg" width={20} height={20} alt="calendar" />
              <p className="text-sm text-gray-300">{formattedDate}</p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Image src="/star.svg" width={20} height={20} alt="star" />
              <p className="text-sm font-semibold text-primary-200">
                {feedback?.totalScore ?? "---"}/100
              </p>
            </div>
          </div>

          {/* Feedback text */}
          <div className="mb-6">
            <p className="line-clamp-3 text-sm text-gray-300 leading-relaxed text-center px-2">
              {feedback?.finalAssessment ||
                "You haven't taken this interview yet. Take it now to improve your skills and get detailed feedback on your performance."}
            </p>
          </div>
        </div>

        {/* Tech Stack Icons - Now using the client component directly */}
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex justify-center">
            <DisplayTechIconsClient techIcons={techIcons} />
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button className="btn-primary w-full max-w-[200px] font-medium">
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
                className="flex items-center justify-center gap-2"
              >
                {feedback ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Check Feedback
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h6m-3-3v6m-3 7h6a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v11a2 2 0 002 2z" />
                    </svg>
                    Start Interview
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}