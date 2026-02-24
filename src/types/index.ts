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
  { id: "basics", name: "基礎理解", description: "情報セキュリティの基本概念・CIA三要素・脅威と脆弱性", icon: "📚", color: "bg-blue-500" },
  { id: "management", name: "組織と管理", description: "ISMS・リスクマネジメント・セキュリティポリシー", icon: "🏢", color: "bg-purple-500" },
  { id: "technology", name: "技術理解", description: "暗号化・認証・ネットワークセキュリティ", icon: "🔧", color: "bg-green-500" },
  { id: "legal", name: "法令・コンプライアンス", description: "個人情報保護法・不正アクセス禁止法・各種ガイドライン", icon: "⚖️", color: "bg-amber-500" },
  { id: "exam-strategy", name: "試験対応力", description: "横断問題・ケーススタディ・時間管理戦略", icon: "🎯", color: "bg-red-500" },
];
