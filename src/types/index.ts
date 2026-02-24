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

export interface ShuffledQuestion extends Omit<Question, "choices" | "correct"> {
  choices: Choice[];
  correct: string;
  originalId: string;
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
  correct: number;
  averageTime: number;
}

export interface UserProgress {
  sessions: SessionResult[];
  questionStats: Record<string, QuestionStats>;
  lastStudyDate: string;
  streakDays: number;
}

export const STAGES: { id: StageId; name: string; description: string; icon: string }[] = [
  { id: "basics", name: "情報セキュリティ基礎", description: "CIA、脅威、脆弱性、リスクの基本概念", icon: "🛡️" },
  { id: "management", name: "情報セキュリティ管理", description: "ISMS、リスクマネジメント、セキュリティポリシー", icon: "📋" },
  { id: "technology", name: "情報セキュリティ対策技術", description: "暗号化、認証、ファイアウォール、マルウェア対策", icon: "🔧" },
  { id: "legal", name: "法務・コンプライアンス", description: "個人情報保護法、不正アクセス禁止法、知的財産", icon: "⚖️" },
  { id: "exam-strategy", name: "総合・試験対策", description: "横断的知識と実践的な問題演習", icon: "🎯" },
];
