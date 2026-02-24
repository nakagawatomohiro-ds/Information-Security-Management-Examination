import { Question, ShuffledQuestion, UserProgress, StageId } from "@/types";
import questions from "@/data/questions.json";

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function shuffleChoices(question: Question): ShuffledQuestion {
  return {
    ...question,
    originalId: question.id,
    choices: shuffle(question.choices),
  };
}

export function selectQuestions(stageId: StageId | "review", progress: UserProgress, count: number = 10): ShuffledQuestion[] {
  let pool: Question[];
  if (stageId === "review") {
    pool = selectReviewQuestions(progress);
  } else {
    pool = selectStageQuestions(stageId, progress);
  }
  return pool.slice(0, count).map(shuffleChoices);
}

function selectStageQuestions(stageId: StageId, progress: UserProgress): Question[] {
  const sq = (questions as Question[]).filter(q => q.stageId === stageId);
  const unlearned: Question[] = [];
  const lowAcc: Question[] = [];
  const rest: Question[] = [];
  for (const q of sq) {
    const s = progress.questionStats[q.id];
    if (!s || s.attempts === 0) unlearned.push(q);
    else if (s.correctCount / s.attempts < 0.5) lowAcc.push(q);
    else rest.push(q);
  }
  return [...shuffle(unlearned), ...shuffle(lowAcc), ...shuffle(rest)];
}

function selectReviewQuestions(progress: UserProgress): Question[] {
  const today = new Date().toISOString().split("T")[0];
  const allQs = questions as Question[];
  const srsDue: Question[] = [];
  const wrongQs: Question[] = [];
  const lowAcc: Question[] = [];
  for (const q of allQs) {
    const s = progress.questionStats[q.id];
    if (!s || s.attempts === 0) continue;
    if (s.nextReview && s.nextReview <= today) srsDue.push(q);
    else if (s.correctCount / s.attempts < 0.5) lowAcc.push(q);
    else if (s.correctCount < s.attempts) wrongQs.push(q);
  }
  return [...shuffle(srsDue), ...shuffle(lowAcc), ...shuffle(wrongQs)];
}

export function getReviewCount(progress: UserProgress): number {
  const today = new Date().toISOString().split("T")[0];
  let count = 0;
  for (const q of questions as Question[]) {
    const s = progress.questionStats[q.id];
    if (!s || s.attempts === 0) continue;
    if ((s.nextReview && s.nextReview <= today) || s.correctCount / s.attempts < 0.5) count++;
  }
  return count;
}
