
export type InterviewStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type Competency =
  | "communication"
  | "grammar_vocabulary"
  | "empathy_customer_focus"
  | "problem_solving"
  | "confidence_professionalism"
  | "relevance_clarity";

export type QuestionType =
  | "main"
  | "follow_up"
  | "closing";

export type InterviewAnswer = {
  question: string;
  answer: string;
  questionType: QuestionType;
  competency: Competency;
};

export type InterviewSession = {
  status: InterviewStatus;

  questionCount: number;
  mainQuestionCount: number;
  followUpCount: number;

  competenciesCovered: Competency[];

  currentCompetency: Competency | null;
  currentQuestionType: QuestionType | null;
  currentQuestion: string | null;

  answers: InterviewAnswer[];
};

export type InterviewTurnMetadata = {
  status: InterviewStatus;
  questionType: QuestionType;
  competency: Competency;
  competenciesCovered: Competency[];
};

export const REQUIRED_COMPETENCIES: Competency[] = [
  "communication",
  "grammar_vocabulary",
  "empathy_customer_focus",
  "problem_solving",
  "confidence_professionalism",
  "relevance_clarity",
];

export const MIN_MAIN_QUESTIONS = 5;

export const MAX_QUESTIONS = 10;

export const MAX_FOLLOW_UPS = 3;

export function createInitialInterviewSession(): InterviewSession {
  return {
    status: "not_started",
    questionCount: 0,
    mainQuestionCount: 0,
    followUpCount: 0,
    competenciesCovered: [],
    currentCompetency: null,
    currentQuestionType: null,
    currentQuestion: null,
    answers: [],
  };
}
