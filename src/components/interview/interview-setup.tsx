
"use client";

import { useState } from "react";
import {
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Target,
} from "lucide-react";

export type InterviewConfig = {
  difficulty: "Beginner-friendly" | "Intermediate" | "Advanced" | "Strict standard";
  passingScore: number;
  recruiter: "Friendly HR Recruiter" | "Professional HR Recruiter" | "Strict HR Recruiter";
  specialization: string;
};

type InterviewSetupProps = {
  onStart: (config: InterviewConfig) => void;
};

const difficultyOptions = [
  {
    name: "Beginner-friendly",
    score: 60,
    description: "Basic questions and supportive evaluation.",
  },
  {
    name: "Intermediate",
    score: 70,
    description: "Balanced questions and realistic expectations.",
  },
  {
    name: "Advanced",
    score: 80,
    description: "Complex scenarios and stronger expectations.",
  },
  {
    name: "Strict standard",
    score: 90,
    description: "Challenging questions and rigorous evaluation.",
  },
] as const;

const recruiterOptions = [
  {
    name: "Friendly HR Recruiter",
    description: "Warm, encouraging, and conversational.",
  },
  {
    name: "Professional HR Recruiter",
    description: "Formal, balanced, and realistic.",
  },
  {
    name: "Strict HR Recruiter",
    description: "Direct, demanding, and analytical.",
  },
] as const;

const specializationOptions = [
  "General Customer Service",
  "Telecommunications",
  "Healthcare",
  "Banking",
  "E-commerce",
  "Technical Support",
];

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [difficulty, setDifficulty] =
    useState<InterviewConfig["difficulty"]>("Intermediate");

  const [recruiter, setRecruiter] =
    useState<InterviewConfig["recruiter"]>(
      "Professional HR Recruiter"
    );

  const [specialization, setSpecialization] = useState(
    "General Customer Service"
  );

  const selectedDifficulty = difficultyOptions.find(
    (option) => option.name === difficulty
  );

  function handleStart() {
    if (!selectedDifficulty) return;

    onStart({
      difficulty,
      passingScore: selectedDifficulty.score,
      recruiter,
      specialization,
    });
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      {/* Page heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit size={22} />
          <span className="text-sm font-semibold">
            CSR Coach AI
          </span>
        </div>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Configure Your Interview
        </h1>

        <p className="text-sm leading-relaxed text-base-content/60">
          Customize your interview difficulty, recruiter personality,
          and customer service specialization before starting.
        </p>
      </div>

      {/* Difficulty selection */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <GraduationCap size={22} />
            </div>

            <div>
              <h2 className="font-bold">Interview Difficulty</h2>
              <p className="text-xs text-base-content/50">
                Determines the assessment passing score.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {difficultyOptions.map((option) => {
              const isSelected = difficulty === option.name;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setDifficulty(option.name)}
                  aria-pressed={isSelected}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">
                      {option.name}
                    </span>

                    {isSelected && (
                      <CheckCircle2
                        size={19}
                        className="text-primary"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs text-base-content/60">
                    {option.description}
                  </p>

                  <p className="mt-3 text-sm font-bold text-primary">
                    {option.score}/100 passing score
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recruiter selection */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h2 className="font-bold">Recruiter Personality</h2>
              <p className="text-xs text-base-content/50">
                Choose how the AI interviewer communicates.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recruiterOptions.map((option) => {
              const isSelected = recruiter === option.name;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setRecruiter(option.name)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-start justify-between gap-3 rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-base-300 hover:border-primary/50"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{option.name}</p>
                    <p className="mt-1 text-xs text-base-content/60">
                      {option.description}
                    </p>
                  </div>

                  {isSelected && (
                    <CheckCircle2
                      size={19}
                      className="shrink-0 text-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Specialization */}
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-info/10 p-3 text-info">
              <Target size={22} />
            </div>

            <div>
              <h2 className="font-bold">Interview Specialization</h2>
              <p className="text-xs text-base-content/50">
                Select the customer service industry.
              </p>
            </div>
          </div>

          <select
            className="select select-bordered w-full"
            value={specialization}
            onChange={(event) =>
              setSpecialization(event.target.value)
            }
          >
            {specializationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Configuration summary */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck size={20} className="text-primary" />
          Your Interview Configuration
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-base-content/50">Difficulty</p>
            <p className="font-semibold">{difficulty}</p>
          </div>

          <div>
            <p className="text-xs text-base-content/50">Passing Score</p>
            <p className="font-semibold">
              {selectedDifficulty?.score}/100
            </p>
          </div>

          <div>
            <p className="text-xs text-base-content/50">Recruiter</p>
            <p className="font-semibold">{recruiter}</p>
          </div>

          <div>
            <p className="text-xs text-base-content/50">
              Specialization
            </p>
            <p className="font-semibold">{specialization}</p>
          </div>
        </div>
      </div>

      {/* Start button */}
      <button
        type="button"
        onClick={handleStart}
        className="btn btn-primary btn-lg w-full"
      >
        Start AI Interview
        <ChevronRight size={20} />
      </button>

      <p className="text-center text-xs text-base-content/50">
        Your interview will adapt to your answers and end when
        sufficient assessment evidence has been collected.
      </p>
    </section>
  );
}
