
import { NextResponse } from "next/server";
import { COMPETENCY_WEIGHTS } from "@/types/interview-evaluation";

const OLLAMA_URL = "http://127.0.0.1:11434/api/chat";
const MODEL_NAME = "qwen2.5:3b";

const PASSING_SCORES = {
  "Beginner-friendly": 60,
  Intermediate: 70,
  Advanced: 80,
  "Strict standard": 90,
} as const;

const COMPETENCY_LABELS = {
  communication: "Communication",
  grammar_vocabulary: "Grammar and Vocabulary",
  empathy_customer_focus: "Empathy and Customer Focus",
  problem_solving: "Problem-Solving",
  confidence_professionalism: "Confidence and Professionalism",
  relevance_clarity: "Relevance and Clarity",
} as const;

type Competency = keyof typeof COMPETENCY_WEIGHTS;

type InterviewConfig = {
  difficulty: keyof typeof PASSING_SCORES;
  passingScore: number;
  recruiter: string;
  specialization: string;
};

type InterviewAnswer = {
  question: string;
  answer: string;
  questionType: string;
  competency: Competency;
};

type RawCompetencyEvaluation = {
  competency: Competency;
  score: number;
  evidence: string;
  strengths: string[];
  improvements: string[];
};

type RawAnswerEvaluation = {
  evaluation: string;
  strengths: string[];
  improvements: string[];
  grammarCorrections: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  suggestedAnswer: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string")
  );
}

function isValidConfig(value: unknown): value is InterviewConfig {
  if (!isObject(value)) return false;

  const difficulty = value.difficulty;

  if (
    typeof difficulty !== "string" ||
    !Object.prototype.hasOwnProperty.call(PASSING_SCORES, difficulty)
  ) {
    return false;
  }

  return (
    value.passingScore ===
      PASSING_SCORES[difficulty as keyof typeof PASSING_SCORES] &&
    typeof value.recruiter === "string" &&
    typeof value.specialization === "string"
  );
}

function isCompetency(value: unknown): value is Competency {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(COMPETENCY_WEIGHTS, value)
  );
}

function buildEvaluationPrompt(
  config: InterviewConfig,
  answers: InterviewAnswer[]
) {
  const transcript = answers.map((item, index) => ({
    number: index + 1,
    question: item.question,
    applicantAnswer: item.answer,
    questionType: item.questionType,
    assignedCompetency: item.competency,
  }));

  return `
You are CSR Coach AI, an expert BPO interview assessor.

Evaluate the applicant's completed simulated customer service interview.

INTERVIEW CONFIGURATION
Difficulty: ${config.difficulty}
Recruiter: ${config.recruiter}
Industry: ${config.specialization}

ASSESSMENT RULES
1. Evaluate only the evidence in the applicant's actual answers.
2. Do not invent experience, achievements, or qualifications.
3. Do not penalize applicants for having no previous BPO experience.
4. Evaluate grammar, clarity, relevance, empathy, and reasoning fairly.
5. Consider the selected difficulty when evaluating answer quality.
6. Give constructive, specific, professional feedback.
7. Do not determine PASS or FAIL. The application calculates this.
8. Score each competency from 0 to 100.
9. Do not automatically give a low score when evidence is limited.
10. Suggested answers must preserve the applicant's truthful experience.
11. Grammar corrections should identify actual language issues.
12. Do not fabricate grammar mistakes when none are present.

COMPETENCY WEIGHTS
- communication: 20%
- grammar_vocabulary: 15%
- empathy_customer_focus: 20%
- problem_solving: 20%
- confidence_professionalism: 15%
- relevance_clarity: 10%

INTERVIEW TRANSCRIPT
${JSON.stringify(transcript, null, 2)}

OUTPUT REQUIREMENTS

Return ONLY valid JSON. Do not use Markdown fences or additional text.

Use exactly this structure:

{
  "summary": "A concise overall assessment.",
  "competencies": [
    {
      "competency": "communication",
      "score": 75,
      "evidence": "Specific evidence from the applicant's answers.",
      "strengths": ["Specific strength"],
      "improvements": ["Specific improvement"]
    }
  ],
  "answerEvaluations": [
    {
      "evaluation": "Evaluation of this particular answer.",
      "strengths": ["What the applicant did well"],
      "improvements": ["What can be improved"],
      "grammarCorrections": [
        {
          "original": "Original phrase",
          "corrected": "Improved phrase",
          "explanation": "Why it is better"
        }
      ],
      "suggestedAnswer": "A polished but truthful version of the applicant's answer."
    }
  ],
  "overallStrengths": [
    "Overall strength"
  ],
  "areasForImprovement": [
    "Overall improvement area"
  ],
  "trainingRecommendations": [
    {
      "skill": "Skill to practice",
      "recommendation": "What the applicant should do",
      "exercise": "A practical exercise"
    }
  ],
  "closingFeedback": "Encouraging and professional closing feedback."
}

IMPORTANT:
- Include exactly six competency objects, one for each competency.
- Use the exact competency keys shown in the weights.
- Include exactly ${answers.length} answer evaluations.
- Keep feedback concise but meaningful.
- Scores must be whole numbers from 0 to 100.
`;
}

function parseAIResponse(content: string): unknown {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
}

function validateEvaluation(
  value: unknown,
  answerCount: number
): value is {
  summary: string;
  competencies: RawCompetencyEvaluation[];
  answerEvaluations: RawAnswerEvaluation[];
  overallStrengths: string[];
  areasForImprovement: string[];
  trainingRecommendations: {
    skill: string;
    recommendation: string;
    exercise: string;
  }[];
  closingFeedback: string;
} {
  if (!isObject(value)) return false;

  if (
    typeof value.summary !== "string" ||
    typeof value.closingFeedback !== "string" ||
    !isStringArray(value.overallStrengths) ||
    !isStringArray(value.areasForImprovement) ||
    !Array.isArray(value.competencies) ||
    !Array.isArray(value.answerEvaluations) ||
    !Array.isArray(value.trainingRecommendations)
  ) {
    return false;
  }

  if (value.competencies.length !== 6) return false;
  if (value.answerEvaluations.length !== answerCount) return false;

  const competencyKeys = new Set<string>();

  for (const item of value.competencies) {
    if (!isObject(item)) return false;

    if (
      !isCompetency(item.competency) ||
      typeof item.score !== "number" ||
      !Number.isFinite(item.score) ||
      item.score < 0 ||
      item.score > 100 ||
      typeof item.evidence !== "string" ||
      !isStringArray(item.strengths) ||
      !isStringArray(item.improvements)
    ) {
      return false;
    }

    if (competencyKeys.has(item.competency)) return false;
    competencyKeys.add(item.competency);
  }

  if (competencyKeys.size !== 6) return false;

  for (const item of value.answerEvaluations) {
    if (
      !isObject(item) ||
      typeof item.evaluation !== "string" ||
      typeof item.suggestedAnswer !== "string" ||
      !isStringArray(item.strengths) ||
      !isStringArray(item.improvements) ||
      !Array.isArray(item.grammarCorrections)
    ) {
      return false;
    }

    for (const correction of item.grammarCorrections) {
      if (
        !isObject(correction) ||
        typeof correction.original !== "string" ||
        typeof correction.corrected !== "string" ||
        typeof correction.explanation !== "string"
      ) {
        return false;
      }
    }
  }

  for (const item of value.trainingRecommendations) {
    if (
      !isObject(item) ||
      typeof item.skill !== "string" ||
      typeof item.recommendation !== "string" ||
      typeof item.exercise !== "string"
    ) {
      return false;
    }
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidConfig(body.config)) {
      return NextResponse.json(
        { error: "Invalid interview configuration." },
        { status: 400 }
      );
    }

    if (!isObject(body.session) || body.session.status !== "completed") {
      return NextResponse.json(
        { error: "Only completed interviews can be evaluated." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.session.answers) ||
      body.session.answers.length === 0 ||
      body.session.answers.length > 12
    ) {
      return NextResponse.json(
        { error: "The interview answers are missing or invalid." },
        { status: 400 }
      );
    }

    const answers: InterviewAnswer[] = [];

    for (const item of body.session.answers) {
      if (
        !isObject(item) ||
        typeof item.question !== "string" ||
        typeof item.answer !== "string" ||
        !isCompetency(item.competency) ||
        typeof item.questionType !== "string" ||
        item.question.length > 3000 ||
        item.answer.length > 3000
      ) {
        return NextResponse.json(
          { error: "An interview answer has an invalid format." },
          { status: 400 }
        );
      }

      answers.push({
        question: item.question,
        answer: item.answer,
        competency: item.competency,
        questionType: item.questionType,
      });
    }

    const prompt = buildEvaluationPrompt(body.config, answers);

    const ollamaResponse = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        stream: false,
        format: "json",
        keep_alive: "30m",
        messages: [
          {
            role: "system",
            content:
              "You are a fair and professional BPO interview evaluator. Return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        options: {
          temperature: 0.2,
          num_predict: 1800,
          num_ctx: 4096,
          top_p: 0.8,
        },
      }),
      signal: AbortSignal.timeout(240000),
    });

    if (!ollamaResponse.ok) {
      console.error(
        "Ollama evaluation error:",
        ollamaResponse.status,
        await ollamaResponse.text()
      );

      return NextResponse.json(
        { error: "The AI evaluation request failed." },
        { status: 502 }
      );
    }

    const data = await ollamaResponse.json();
    const content = data.message?.content;

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "The AI returned an empty evaluation." },
        { status: 502 }
      );
    }

    let rawEvaluation: unknown;

    try {
      rawEvaluation = parseAIResponse(content);
    } catch {
      console.error("Invalid JSON from evaluation model:", content);

      return NextResponse.json(
        {
          error:
            "The AI returned an invalid evaluation format. Please try again.",
        },
        { status: 502 }
      );
    }

    if (!validateEvaluation(rawEvaluation, answers.length)) {
      console.error("Evaluation validation failed:", rawEvaluation);

      return NextResponse.json(
        {
          error:
            "The AI evaluation was incomplete or invalid. Please try again.",
        },
        { status: 502 }
      );
    }

    const competencyResults = rawEvaluation.competencies.map((item) => ({
      competency: item.competency,
      label: COMPETENCY_LABELS[item.competency],
      weight: COMPETENCY_WEIGHTS[item.competency],
      score: Math.round(item.score),
      evidence: item.evidence,
      strengths: item.strengths,
      improvements: item.improvements,
    }));

    const weightedScore = competencyResults.reduce(
      (total, item) => total + item.score * (item.weight / 100),
      0
    );

    const overallScore = Math.round(weightedScore);
    const passingScore = body.config.passingScore;

    const result = overallScore >= passingScore ? "PASS" : "FAIL";

    const evaluation = {
      overallScore,
      passingScore,
      result,
      summary: rawEvaluation.summary,
      competencies: competencyResults,
      answerEvaluations: rawEvaluation.answerEvaluations.map(
        (item, index) => ({
          question: answers[index].question,
          applicantAnswer: answers[index].answer,
          evaluation: item.evaluation,
          strengths: item.strengths,
          improvements: item.improvements,
          grammarCorrections: item.grammarCorrections,
          suggestedAnswer: item.suggestedAnswer,
        })
      ),
      overallStrengths: rawEvaluation.overallStrengths,
      areasForImprovement: rawEvaluation.areasForImprovement,
      trainingRecommendations: rawEvaluation.trainingRecommendations,
      closingFeedback: rawEvaluation.closingFeedback,
    };

    return NextResponse.json({
      evaluation,
      model: MODEL_NAME,
      configuration: body.config,
    });
  } catch (error) {
    console.error("Interview evaluation error:", error);

    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return NextResponse.json(
      {
        error: isTimeout
          ? "The AI evaluation took too long. Please try again."
          : "Unable to complete the evaluation. Check that Ollama is running.",
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
