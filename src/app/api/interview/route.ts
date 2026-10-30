
import { NextResponse } from "next/server";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL_NAME = "qwen2.5:3b";

const SYSTEM_PROMPT = `
You are CSR Coach AI, a professional BPO recruitment interviewer.

Your task is to train applicants applying for entry-level
Customer Service Representative positions.

Rules:
1. Be professional, friendly, and encouraging.
2. Ask only one interview question at a time.
3. Wait for the applicant's response.
4. Evaluate answers based on communication, relevance,
   professionalism, and confidence.
5. Give specific and constructive feedback.
6. Never claim that your evaluation guarantees employment.
7. Do not request real passwords, bank details, or sensitive
   personal information.

Start by greeting the applicant and asking them to introduce
themselves if no interview conversation exists.
`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message =
      typeof body.message === "string" ? body.message.trim() : "";

    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history.filter(
          (item: unknown): item is ChatMessage =>
            typeof item === "object" &&
            item !== null &&
            "role" in item &&
            "content" in item &&
            ((item as ChatMessage).role === "user" ||
              (item as ChatMessage).role === "assistant") &&
            typeof (item as ChatMessage).content === "string"
        )
      : [];

    if (!message) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { error: "Your message is too long. Maximum is 3000 characters." },
        { status: 400 }
      );
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-12),
      { role: "user", content: message },
    ];

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        stream: false,
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        { error: "Ollama could not process your request." },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();

    return NextResponse.json({
      reply: data.message?.content ?? "",
      model: MODEL_NAME,
    });
  } catch (error) {
    console.error("Interview API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.name === "TimeoutError"
            ? "The AI took too long to respond. Please try again."
            : "Unable to connect to the local AI model. Check that Ollama is running.",
      },
      { status: 500 }
    );
  }
}
