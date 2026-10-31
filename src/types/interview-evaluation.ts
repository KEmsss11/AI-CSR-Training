
export type CompetencyEvaluation = {
  competency:
    | "communication"
    | "grammar_vocabulary"
    | "empathy_customer_focus"
    | "problem_solving"
    | "confidence_professionalism"
    | "relevance_clarity";

  label: string;
  weight: number;
  score: number;
  evidence: string;
  strengths: string[];
  improvements: string[];
};

export type AnswerEvaluation = {
  question: string;
  applicantAnswer: string;
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

export type InterviewEvaluation = {
  overallScore: number;
  passingScore: number;
  result: "PASS" | "FAIL";

  summary: string;

  competencies: CompetencyEvaluation[];

  answerEvaluations: AnswerEvaluation[];

  overallStrengths: string[];
  areasForImprovement: string[];

  trainingRecommendations: {
    skill: string;
    recommendation: string;
    exercise: string;
  }[];

  closingFeedback: string;
};

export const COMPETENCY_WEIGHTS = {
  communication: 20,
  grammar_vocabulary: 15,
  empathy_customer_focus: 20,
  problem_solving: 20,
  confidence_professionalism: 15,
  relevance_clarity: 10,
} as const;
