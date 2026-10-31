
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  LoaderCircle,
  RotateCcw,
  Send,
  User,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import type { InterviewConfig } from "./interview-setup";
import {
  createInitialInterviewSession,
  REQUIRED_COMPETENCIES,
  type InterviewSession,
} from "@/types/interview-session";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type InterviewChatProps = {
  config: InterviewConfig;
};

const START_MESSAGE =
  "Please begin the interview. Greet me professionally and ask your first interview question.";

const COMPETENCY_LABELS: Record<string, string> = {
  communication: "Communication",
  grammar_vocabulary: "Grammar & Vocabulary",
  empathy_customer_focus: "Empathy & Customer Focus",
  problem_solving: "Problem-Solving",
  confidence_professionalism: "Confidence & Professionalism",
  relevance_clarity: "Relevance & Clarity",
};

export function InterviewChat({ config }: InterviewChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [session, setSession] = useState<InterviewSession>(
    createInitialInterviewSession
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const isCompleted = session.status === "completed";

  // ==========================================
  // START OR RESTART INTERVIEW
  // ==========================================

  const startInterview = useCallback(async () => {
    setMessages([]);
    setDraft("");
    setSession(createInitialInterviewSession());
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: START_MESSAGE,
          history: [],
          config,
          session: createInitialInterviewSession(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to start the interview."
        );
      }

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        typeof data.session !== "object" ||
        data.session === null
      ) {
        throw new Error("The AI returned an invalid response.");
      }

      setMessages([
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      setSession(data.session as InterviewSession);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to start the interview.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      void startInterview();
    }
  }, [startInterview]);

  // ==========================================
  // AUTO-SCROLL
  // ==========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  // ==========================================
  // SEND APPLICANT ANSWER
  // ==========================================

  async function handleSend() {
    const userMessage = draft.trim();

    if (
      !userMessage ||
      isLoading ||
      isCompleted ||
      session.status !== "in_progress"
    ) {
      return;
    }

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setMessages(updatedMessages);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
          config,
          session,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to get a response from the AI."
        );
      }

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim() ||
        typeof data.session !== "object" ||
        data.session === null
      ) {
        throw new Error("The AI returned an invalid response.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      setSession(data.session as InterviewSession);

      if (data.session.status === "completed") {
        toast.success("Interview completed!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // ==========================================
  // RESTART INTERVIEW
  // ==========================================

  function handleReset() {
    if (isLoading) {
      return;
    }

    void startInterview();
    toast.success("Starting a new interview.");
  }

  // ==========================================
  // KEYBOARD SHORTCUT
  // ==========================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  // ==========================================
  // INTERVIEW UI
  // ==========================================

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-5">

      {/* Interview Header */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bot size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold sm:text-2xl">
              AI Interview Practice
            </h1>

            <p className="text-sm text-base-content/60">
              Practice your BPO interview with your local AI coach.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={handleReset}
          disabled={isLoading}
        >
          <RotateCcw size={16} />
          Restart Interview
        </button>
      </div>

      {/* AI Status */}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-base-300 bg-base-200/50 px-4 py-3">
        <span
          className={`size-2 rounded-full ${
            isCompleted ? "bg-success" : "bg-success"
          }`}
        />

        <span className="text-xs font-medium">
          Qwen 2.5 3B · {config.difficulty} · Local AI
        </span>

        <span className="text-xs text-base-content/50 sm:ml-auto">
          {config.specialization}
        </span>
      </div>

      {/* Interview Progress */}

      <div className="rounded-xl border border-base-300 bg-base-100 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">
            Interview Progress
          </h2>

          <span className="text-xs text-base-content/60">
            {session.questionCount} / 10 questions
          </span>
        </div>

        <progress
          className="progress progress-primary w-full"
          value={session.questionCount}
          max={10}
        />

        <div className="mt-3 flex flex-wrap gap-4 text-xs text-base-content/60">
          <span>
            Main questions: {session.mainQuestionCount}
          </span>

          <span>
            Follow-ups: {session.followUpCount}
          </span>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold">
            Competencies assessed
          </p>

          <div className="flex flex-wrap gap-2">
            {REQUIRED_COMPETENCIES.map((competency) => {
              const covered =
                session.competenciesCovered.includes(competency);

              return (
                <span
                  key={competency}
                  className={`badge badge-sm ${
                    covered
                      ? "badge-success"
                      : "badge-outline"
                  }`}
                >
                  {covered && <CheckCircle2 size={12} />}
                  {COMPETENCY_LABELS[competency]}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Window */}

      <div className="flex h-137.5 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">

        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <div>
            <h2 className="font-semibold">
              Interview Conversation
            </h2>

            <p className="text-xs text-base-content/50">
              Answer naturally. Take your time.
            </p>
          </div>

          <span
            className={`badge ${
              isCompleted
                ? "badge-success"
                : "badge-success badge-outline"
            }`}
          >
            {isCompleted ? "Completed" : "Practice Mode"}
          </span>
        </div>

        {/* Messages */}

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">

          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot size={19} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${
                    isUser
                      ? "rounded-tr-sm bg-primary text-primary-content"
                      : "rounded-tl-sm bg-base-200 text-base-content"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-base-300 text-base-content">
                    <User size={19} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={19} />
              </div>

              <div className="flex items-center gap-2 rounded-2xl bg-base-200 px-4 py-3 text-sm text-base-content/60">
                <LoaderCircle
                  size={16}
                  className="animate-spin"
                />
                AI is preparing your response...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Message Composer */}

        <div className="border-t border-base-300 p-4">

          {isCompleted ? (
            <div className="rounded-xl bg-success/10 p-4 text-center">
              <CheckCircle2
                size={24}
                className="mx-auto mb-2 text-success"
              />

              <p className="font-semibold">
                Interview completed!
              </p>

              <p className="mt-1 text-sm text-base-content/60">
                Your interview answers are ready for the final assessment.
              </p>

              <p className="mt-3 text-xs text-base-content/50">
                Final evaluation will be available in the next development step.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-end gap-2 rounded-2xl border border-base-300 bg-base-200/50 p-2 focus-within:border-primary">
                <textarea
                  className="min-h-12 max-h-32 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-base-content/40"
                  placeholder="Type your interview answer..."
                  value={draft}
                  onChange={(event) =>
                    setDraft(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || session.status !== "in_progress"}
                  rows={1}
                  aria-label="Your interview answer"
                />

                <button
                  type="button"
                  className="btn btn-primary btn-square"
                  onClick={() => void handleSend()}
                  disabled={
                    !draft.trim() ||
                    isLoading ||
                    session.status !== "in_progress"
                  }
                  aria-label="Send answer"
                >
                  {isLoading ? (
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />
                  ) : (
                    <Send size={19} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-center text-xs text-base-content/50">
                Press Enter to send · Shift + Enter for a new line
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
