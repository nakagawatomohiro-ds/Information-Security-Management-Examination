export type Difficulty = 1 | 2 | 3;

export type StageId =
  | "basics"
  | "management"
  | "technology"
  | "legal"
  | "exam-strategy";

export interface Choice {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  stageId: StageId;
  difficulty: Difficulty;
  body: string;
  choices: Choice[];
  correct: string;
  explanation: string;
  tags: string[];
}

export interface ShuffledQuestion {
  id: string;
  originalId: string;
  stageId: StageId;
  difficulty: Difficulty;
  body: string;
  choices: Choice[];
  correct: string;
  explanation: string;
  tags: string[];
}

export interface QuestionResult {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface SessionResult {
  id: string;
  stageId: StageId;
  date: string;
  results: QuestionResult[];
  score: number;
  totalTime: number;
}

export interface QuestionStats {
  questionId: string;
  attempts: number;
  correctCount: number;
  lastAttempt: string;
  nextReview: string | null;
  srsLevel: number;
}

export interface UserProgress {
  totalScore: number;
  sessions: SessionResult[];
  questionStats: Record<string, QuestionStats>;
  streak: number;
  lastStudyDate: string | null;
  startDate: string;
}

export interface StageInfo {
  id: StageId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const STAGES: StageInfo[] = [
  { id: "basics", name: "åºç¤çè§£", description: "æå ±ã»ã­ã¥ãªãã£ã®åºæ¬æ¦å¿µã»CIAä¸è¦ç´ ã»èå¨ã¨èå¼±æ§", icon: "ð", color: "bg-blue-500" },
  { id: "management", name: "çµç¹ã¨ç®¡ç", description: "ISMSã»ãªã¹ã¯ããã¸ã¡ã³ãã»ã»ã­ã¥ãªãã£ããªã·ã¼", icon: "ð¢", color: "bg-purple-500" },
  { id: "technology", name: "æè¡çè§£", description: "æå·åã»èªè¨¼ã»ãããã¯ã¼ã¯ã»ã­ã¥ãªãã£", icon: "ð§", color: "bg-green-500" },
  { id: "legal", name: "æ³ä»¤ã»ã³ã³ãã©ã¤ã¢ã³ã¹", description: "åäººæå ±ä¿è­·æ³ã»ä¸æ­£ã¢ã¯ã»ã¹ç¦æ­¢æ³ã»åç¨®ã¬ã¤ãã©ã¤ã³", icon: "âï¸", color: "bg-amber-500" },
  { id: "exam-strategy", name: "è©¦é¨å¯¾å¿å", description: "æ¨ªæ­åé¡ã»ã±ã¼ã¹ã¹ã¿ãã£ã»æéç®¡çæ¦ç¥", icon: "ð¯", color: "bg-red-500" },
];
