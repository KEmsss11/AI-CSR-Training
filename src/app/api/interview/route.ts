
import { NextResponse } from "next/server";

import {
  createInitialInterviewSession,
  REQUIRED_COMPETENCIES,
  MIN_MAIN_QUESTIONS,
  MAX_QUESTIONS,
  MAX_FOLLOW_UPS,
  type InterviewSession,
  type Competency,
  type QuestionType,
} from "@/types/interview-session";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL_NAME = "qwen2.5:3b";

// ==========================================
// 1. INTERVIEW CONFIGURATION TYPES
// ==========================================

type Difficulty =
  | "Beginner-friendly"
  | "Intermediate"
  | "Advanced"
  | "Strict standard";

type Recruiter =
  | "Friendly HR Recruiter"
  | "Professional HR Recruiter"
  | "Strict HR Recruiter";

type Specialization =
  | "General Customer Service"
  | "Telecommunications"
  | "Healthcare"
  | "Banking"
  | "E-commerce"
  | "Technical Support";

type InterviewConfig = {
  difficulty: Difficulty;
  passingScore: number;
  recruiter: Recruiter;
  specialization: Specialization;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ==========================================
// 2. CONFIGURATION VALIDATION
// ==========================================

const PASSING_SCORES: Record<Difficulty, number> = {
  "Beginner-friendly": 60,
  Intermediate: 70,
  Advanced: 80,
  "Strict standard": 90,
};

const VALID_RECRUITERS: Recruiter[] = [
  "Friendly HR Recruiter",
  "Professional HR Recruiter",
  "Strict HR Recruiter",
];

const VALID_SPECIALIZATIONS: Specialization[] = [
  "General Customer Service",
  "Telecommunications",
  "Healthcare",
  "Banking",
  "E-commerce",
  "Technical Support",
];

function isValidConfig(value: unknown): value is InterviewConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;

  return (
    typeof config.difficulty === "string" &&
    config.difficulty in PASSING_SCORES &&
    typeof config.passingScore === "number" &&
    config.passingScore ===
      PASSING_SCORES[config.difficulty as Difficulty] &&
    typeof config.recruiter === "string" &&
    VALID_RECRUITERS.includes(config.recruiter as Recruiter) &&
    typeof config.specialization === "string" &&
    VALID_SPECIALIZATIONS.includes(
      config.specialization as Specialization
    )
  );
}

// ==========================================
// 3. SESSION VALIDATION
// ==========================================

function isCompetency(value: unknown): value is Competency {
  return (
    typeof value === "string" &&
    REQUIRED_COMPETENCIES.includes(value as Competency)
  );
}

function isQuestionType(value: unknown): value is QuestionType {
  return (
    value === "main" ||
    value === "follow_up" ||
    value === "closing"
  );
}

function getSession(value: unknown): InterviewSession {
  if (typeof value !== "object" || value === null) {
    return createInitialInterviewSession();
  }

  const data = value as Record<string, unknown>;

  if (
    data.status !== "in_progress" ||
    !Number.isInteger(data.questionCount) ||
    !Number.isInteger(data.mainQuestionCount) ||
    !Number.isInteger(data.followUpCount) ||
    !Array.isArray(data.competenciesCovered) ||
    !Array.isArray(data.answers)
  ) {
    return createInitialInterviewSession();
  }

  const competenciesCovered = data.competenciesCovered.filter(
    isCompetency
  );

  const answers = data.answers.filter((answer: unknown) => {
    if (typeof answer !== "object" || answer === null) {
      return false;
    }

    const item = answer as Record<string, unknown>;

    return (
      typeof item.question === "string" &&
      typeof item.answer === "string" &&
      isQuestionType(item.questionType) &&
      isCompetency(item.competency)
    );
  });

  return {
    status: "in_progress",
    questionCount: Math.min(
      Math.max(Number(data.questionCount), 0),
      MAX_QUESTIONS
    ),
    mainQuestionCount: Math.min(
      Math.max(Number(data.mainQuestionCount), 0),
      MAX_QUESTIONS
    ),
    followUpCount: Math.min(
      Math.max(Number(data.followUpCount), 0),
      MAX_FOLLOW_UPS
    ),
    competenciesCovered: [...new Set(competenciesCovered)],
    currentCompetency: isCompetency(data.currentCompetency)
      ? data.currentCompetency
      : null,
    currentQuestionType: isQuestionType(data.currentQuestionType)
      ? data.currentQuestionType
      : null,
    currentQuestion:
      typeof data.currentQuestion === "string"
        ? data.currentQuestion
        : null,
    answers,
  };
}

// ==========================================
// 4. RECRUITER INSTRUCTIONS
// ==========================================

function getRecruiterInstructions(recruiter: Recruiter) {
  switch (recruiter) {
    case "Friendly HR Recruiter":
      return `
Be warm, approachable, encouraging, and conversational.
Help applicants feel comfortable while maintaining professionalism.
`;

    case "Professional HR Recruiter":
      return `
Be formal, balanced, respectful, and realistic.
Ask clear questions and maintain a professional interview tone.
`;

    case "Strict HR Recruiter":
      return `
Be direct, analytical, and demanding.
Expect specific examples and clear explanations.
Remain respectful and never insult or intimidate the applicant.
`;

    default:
      return "";
  }
}

// ==========================================
// 5. DIFFICULTY INSTRUCTIONS
// ==========================================

function getDifficultyInstructions(difficulty: Difficulty) {
  switch (difficulty) {
    case "Beginner-friendly":
      return `
Use straightforward questions suitable for applicants
with little or no BPO experience.
`;

    case "Intermediate":
      return `
Use realistic entry-level BPO questions.
Expect clear explanations and practical examples.
`;

    case "Advanced":
      return `
Use challenging situational and behavioral questions.
Expect detailed explanations, adaptability, and strong reasoning.
`;

    case "Strict standard":
      return `
Use demanding, realistic recruitment questions.
Expect structured answers, empathy, sound judgment,
and effective problem-solving.
`;

    default:
      return "";
  }
}

// ==========================================
// 6. INDUSTRY SPECIALIZATION
// ==========================================

function getSpecializationInstructions(
  specialization: Specialization
) {
  switch (specialization) {
    case "Telecommunications":
      return `
Focus on billing disputes, internet connectivity,
service interruptions, plan inquiries, and frustrated subscribers.
`;

    case "Healthcare":
      return `
Focus on appointment inquiries, patient communication,
scheduling, privacy awareness, and empathetic service.
Do not expect medical diagnoses.
`;

    case "Banking":
      return `
Focus on account inquiries, transaction concerns,
card issues, and fraud awareness.
Never request actual account numbers or banking credentials.
`;

    case "E-commerce":
      return `
Focus on order tracking, refunds, returns,
delivery delays, and dissatisfied online shoppers.
`;

    case "Technical Support":
      return `
Focus on troubleshooting, identifying technical problems,
explaining solutions, and guiding customers through steps.
`;

    case "General Customer Service":
      return `
Focus on customer concerns, complaint handling,
communication, empathy, and problem-solving.
`;

    default:
      return "";
  }
}

// ==========================================
// 7. SYSTEM PROMPT
// ==========================================

function buildSystemPrompt(config: InterviewConfig) {
  return `
You are CSR Coach AI, a professional BPO recruitment interviewer.

You are conducting a simulated entry-level Customer Service
Representative interview.

CONFIGURATION

Difficulty: ${config.difficulty}
Passing score: ${config.passingScore}/100
Recruiter personality: ${config.recruiter}
Industry: ${config.specialization}

RECRUITER PERSONALITY

${getRecruiterInstructions(config.recruiter)}

DIFFICULTY

${getDifficultyInstructions(config.difficulty)}

INDUSTRY

${getSpecializationInstructions(config.specialization)}

INTERVIEW RULES

1. Ask only ONE question at a time.
2. Wait for the applicant's answer.
3. Never give scores or feedback during the interview.
4. Never reveal the evaluation rubric.
5. Adapt questions to the applicant's previous answers.
6. Ask realistic customer service and behavioral questions.
7. Maintain the selected recruiter personality.
8. Never request passwords or sensitive information.
9. Keep questions appropriate for the selected industry.
10. Do not repeat questions unnecessarily.

IMPORTANT

You will receive an instruction specifying the next competency
and whether to ask a main question, follow-up, or closing message.

Follow that instruction exactly.

Return only the natural interview message.
Do not include internal labels, competency names, scores,
JSON, or explanations.
`;
}

// ==========================================
// 8. BUILD NEXT INTERVIEW TURN
// ==========================================

function getNextTurn(session: InterviewSession): {
  status: "in_progress" | "completed";
  questionType: QuestionType;
  competency: Competency | null;
  instructions: string;
} {
  const allCompetenciesCovered = REQUIRED_COMPETENCIES.every(
    (competency) =>
      session.competenciesCovered.includes(competency)
  );

  const interviewComplete =
    session.mainQuestionCount >= MIN_MAIN_QUESTIONS &&
    allCompetenciesCovered;

  const reachedQuestionLimit =
    session.questionCount >= MAX_QUESTIONS;

  if (interviewComplete || reachedQuestionLimit) {
    return {
      status: "completed",
      questionType: "closing",
      competency: null,
      instructions: `
The interview is complete.
Thank the applicant for participating.
Politely explain that the interview has ended.
Do not provide scores or evaluation results.
Do not ask another question.
`,
    };
  }

  const currentAnswer =
    session.answers[session.answers.length - 1];

  const answerIsShort =
    currentAnswer !== undefined &&
    currentAnswer.answer.trim().length < 120;

  const canAskFollowUp =
    answerIsShort &&
    session.followUpCount < MAX_FOLLOW_UPS &&
    session.questionCount < MAX_QUESTIONS;

  if (canAskFollowUp && session.currentCompetency) {
    return {
      status: "in_progress",
      questionType: "follow_up",
      competency: session.currentCompetency,
      instructions: `
Ask ONE short follow-up question about the applicant's
previous answer.

Competency being explored: ${session.currentCompetency}

Encourage the applicant to provide more details or an example.
Do not criticize their answer.
`,
    };
  }

  const nextCompetency = REQUIRED_COMPETENCIES.find(
    (competency) =>
      !session.competenciesCovered.includes(competency)
  );

  if (!nextCompetency) {
    return {
      status: "completed",
      questionType: "closing",
      competency: null,
      instructions: `
Thank the applicant for participating.
Politely conclude the interview without asking another question.
`,
    };
  }

  return {
    status: "in_progress",
    questionType: "main",
    competency: nextCompetency,
    instructions: `
Ask ONE main interview question.

Competency to assess: ${nextCompetency}

Create a realistic, relevant question that allows the applicant
to demonstrate this competency.
Do not mention the competency name.
`,
  };
}

// ==========================================
// 9. INTERVIEW API
// ==========================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!message) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { error: "Maximum message length is 3000 characters." },
        { status: 400 }
      );
    }

    if (!isValidConfig(body.config)) {
      return NextResponse.json(
        { error: "Invalid interview configuration." },
        { status: 400 }
      );
    }

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

    const isStarting =
      body.session === undefined ||
      body.session === null ||
      (typeof body.session === "object" &&
        body.session !== null &&
        (body.session as Record<string, unknown>).status ===
          "not_started");

    const session = isStarting
      ? createInitialInterviewSession()
      : getSession(body.session);

    // ==========================================
    // 10. RECORD APPLICANT ANSWER
    // ==========================================

    if (!isStarting) {
      if (session.status !== "in_progress") {
        return NextResponse.json(
          { error: "This interview session is no longer active." },
          { status: 409 }
        );
      }

      if (
        !session.currentQuestion ||
        !session.currentCompetency ||
        !session.currentQuestionType
      ) {
        return NextResponse.json(
          { error: "Interview session information is incomplete." },
          { status: 400 }
        );
      }

      session.answers.push({
        question: session.currentQuestion,
        answer: message,
        questionType: session.currentQuestionType,
        competency: session.currentCompetency,
      });

      if (message.length >= 120 ||
          session.followUpCount >= MAX_FOLLOW_UPS) {
        session.competenciesCovered = [
          ...new Set([
            ...session.competenciesCovered,
            session.currentCompetency,
          ]),
        ];
      }
    }

    // ==========================================
    // 11. DETERMINE NEXT QUESTION
    // ==========================================

    let turn: ReturnType<typeof getNextTurn>;

    if (isStarting) {
      turn = {
        status: "in_progress",
        questionType: "main",
        competency: "communication",
        instructions: `
Greet the applicant professionally.
Introduce yourself as the AI interviewer.
Ask the applicant to introduce themselves
and briefly describe their background.
Ask only ONE question.
`,
      };
    } else {
      turn = getNextTurn(session);
    }

    // ==========================================
    // 12. PREPARE SESSION COUNTERS
    // ==========================================

    if (turn.status === "completed") {
      session.status = "completed";
      session.currentQuestion = null;
      session.currentQuestionType = null;
      session.currentCompetency = null;
    } else {
      session.status = "in_progress";

      session.questionCount += 1;

      if (turn.questionType === "main") {
        session.mainQuestionCount += 1;
      }

      if (turn.questionType === "follow_up") {
        session.followUpCount += 1;
      }
    }

    // ==========================================
    // 13. PREPARE OLLAMA MESSAGES
    // ==========================================

    const systemPrompt = buildSystemPrompt(body.config);

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...history.slice(-6),
      {
        role: "user",
        content: `
APPLICANT'S LATEST MESSAGE:
${message}

NEXT INTERVIEW INSTRUCTION:
${turn.instructions}

Remember: Return only the natural interview message.
`,
      },
    ];

    // ==========================================
    // 14. CALL LOCAL OLLAMA
    // ==========================================

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages,
        stream: false,
        keep_alive: "30m",
        options: {
          temperature: 0.5,
          num_predict: 160,
          num_ctx: 4096,
          top_p: 0.9,
        },
      }),
      signal: AbortSignal.timeout(180000),
    });

    if (!ollamaResponse.ok) {
      console.error(
        "Ollama response error:",
        ollamaResponse.status,
        await ollamaResponse.text()
      );

      return NextResponse.json(
        { error: "Ollama could not process your request." },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();
    const reply = data.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    // ==========================================
    // 15. SAVE CURRENT QUESTION
    // ==========================================

    if (turn.status === "in_progress") {
      session.currentQuestion = reply.trim();
      session.currentQuestionType = turn.questionType;
      session.currentCompetency = turn.competency;
    }

    // ==========================================
    // 16. RETURN RESPONSE
    // ==========================================

    return NextResponse.json({
      reply: reply.trim(),
      model: MODEL_NAME,
      configuration: body.config,
      session,
    });
  } catch (error) {
    console.error("Interview API error:", error);

    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" ||
        error.name === "AbortError");

    return NextResponse.json(
      {
        error: isTimeout
          ? "The AI took too long to respond. Please try again."
          : "Unable to connect to the local AI model. Check that Ollama is running.",
      },
      {
        status: isTimeout ? 504 : 500,
      }
    );
  }
}
