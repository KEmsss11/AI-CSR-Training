
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bot,
  LoaderCircle,
  RotateCcw,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hello! Welcome to CSR Coach AI. I'm your AI BPO interviewer. I'll ask you one question at a time and provide feedback to help you improve. Let's begin: Tell me about yourself.",
};

export function InterviewChat() {
  const [messages, setMessages] = useState<Message[]>([
    INITIAL_MESSAGE,
  ]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  async function handleSend() {
    const userMessage = draft.trim();

    if (!userMessage || isLoading) {
      return;
    }

    const updatedMessages = [
      ...messages,
      { role: "user" as const, content: userMessage },
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to get a response from the AI."
        );
      }

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("The AI returned an empty response.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
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

  function handleReset() {
    if (isLoading) {
      return;
    }

    setMessages([INITIAL_MESSAGE]);
    setDraft("");
    toast.success("Interview restarted.");
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

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
      <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-200/50 px-4 py-3">
        <span className="size-2 rounded-full bg-success" />
        <span className="text-xs font-medium">
          Qwen 2.5 3B · Local AI
        </span>
        <span className="ml-auto text-xs text-base-content/50">
          Your messages are processed by your local Ollama model.
        </span>
      </div>

      {/* Chat Window */}
     <div className="flex h-137.5 flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
          <div>
            <h2 className="font-semibold">Interview Conversation</h2>
            <p className="text-xs text-base-content/50">
              Answer naturally. Take your time.
            </p>
          </div>

          <span className="badge badge-success badge-outline">
            Practice Mode
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
                <LoaderCircle size={16} className="animate-spin" />
                AI is preparing your response...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Message Composer */}
        <div className="border-t border-base-300 p-4">
          <div className="flex items-end gap-2 rounded-2xl border border-base-300 bg-base-200/50 p-2 focus-within:border-primary">
            <textarea
              className="min-h-12 max-h-32 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-base-content/40"
              placeholder="Type your interview answer..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              aria-label="Your interview answer"
            />

            <button
              type="button"
              className="btn btn-primary btn-square"
              onClick={() => void handleSend()}
              disabled={!draft.trim() || isLoading}
              aria-label="Send answer"
            >
              {isLoading ? (
                <LoaderCircle size={19} className="animate-spin" />
              ) : (
                <Send size={19} />
              )}
            </button>
          </div>

          <p className="mt-2 text-center text-xs text-base-content/50">
            Press Enter to send · Shift + Enter for a new line
          </p>
        </div>
      </div>
    </section>
  );
}
