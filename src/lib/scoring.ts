import { UserProgress, SessionResult, StageId, STAGES } from "@/types";
import questions from "@/data/questions.json";

export function calculateTotalScore(progress: UserProgress): number {
  if (progress.sessions.length === 0) return 0;
  const b = calcBasic(progress); const d = calcDiff(progress); const w = calcWeak(progress);
  const s = Math.min(50, progress.streak * 5);
  const stagesCovered = new Set<string>();
  for (const st of Object.values(progress.questionStats)) { const q = questions.find(qq => qq.id === st.questionId); if (q && st.attempts > 0) stagesCovered.add(q.stage); }
  const c = (stagesCovered.size / STAGES.length) * 50;
  return Math.min(1000, Math.round(b + d + w + s + c));
}
function calcBasic(p: UserProgress): number {
  const stats = Object.values(p.questionStats); if (stats.length === 0) return 0;
  const ta = stats.reduce((s, x) => s + x.attempts, 0); const tc = stats.reduce((s, x) => s + x.correctCount, 0);
  if (ta === 0) return 0; return (tc / ta) * (stats.length / questions.length) * 600;
}
function calcDiff(p: UserProgress): number {
  const stats = Object.values(p.questionStats); if (stats.length === 0) return 0;
  let bonus = 0; for (const s of stats) { const q = questions.find(qq => qq.id === s.questionId); if (!q || s.attempts === 0) continue; bonus += (s.correctCount / s.attempts) * (q.difficulty / 3) * (200 / questions.length); }
  return Math.min(200, bonus);
}
function calcWeak(p: UserProgress): number {
  const stats = Object.values(p.questionStats); if (stats.length === 0) return 0;
  let improved = 0; for (const s of stats) { if (s.attempts >= 2 && s.correctCount > 0 && s.correctCount < s.attempts) improved++; }
  return Math.min(100, (improved / Math.max(1, stats.length)) * 100);
}
export function calculateSessionScore(session: SessionResult): number {
  const correct = session.results.filter(r => r.isCorrect).length;
  return Math.round((correct / session.results.length) * 1000);
}
export function getStageAccuracy(progress: UserProgress, stageId: StageId): number {
  const sq = questions.filter(q => q.stage === stageId); let ta = 0, tc = 0;
  for (const q of sq) { const s = progress.questionStats[q.id]; if (s) { ta += s.attempts; tc += s.correctCount; } }
  return ta === 0 ? 0 : tc / ta;
}
export function getStageProgress(progress: UserProgress, stageId: StageId): number {
  const sq = questions.filter(q => q.stage === stageId); if (sq.length === 0) return 0;
  let a = 0; for (const q of sq) { if (progress.questionStats[q.id]?.attempts > 0) a++; } return a / sq.length;
}
export function getTagAccuracy(progress: UserProgress): Record<string, { correct: number; total: number; rate: number }> {
  const ts: Record<string, { correct: number; total: number; rate: number }> = {};
  for (const q of questions) { const s = progress.questionStats[q.id]; if (!s || s.attempts === 0) continue;
    for (const tag of q.tags) { if (!ts[tag]) ts[tag] = { correct: 0, total: 0, rate: 0 }; ts[tag].total += s.attempts; ts[tag].correct += s.correctCount; } }
  for (const k of Object.keys(ts)) { ts[k].rate = ts[k].correct / ts[k].total; } return ts;
}
export function isPassingScore(progress: UserProgress): boolean {
  if (calculateTotalScore(progress) < 800) return false;
  for (const stage of STAGES) { if (getStageAccuracy(progress, stage.id) < 0.7) return false; } return true;
}
