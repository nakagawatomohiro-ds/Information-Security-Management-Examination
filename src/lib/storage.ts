"use client";

import { UserProgress, QuestionStats, SessionResult } from "@/types";

const STORAGE_KEY = "dscss-sg-progress";

function getDefaultProgress(): UserProgress {
  return { totalScore: 0, sessions: [], questionStats: {}, streak: 0, lastStudyDate: null, startDate: new Date().toISOString().split("T")[0] };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch { return getDefaultProgress(); }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  if (progress.lastStudyDate === today) return progress;
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = progress.lastStudyDate === yesterday ? progress.streak + 1 : 1;
  return { ...progress, streak: newStreak, lastStudyDate: today };
}

export function addSessionResult(progress: UserProgress, session: SessionResult): UserProgress {
  const updated = updateStreak(progress);
  const newSessions = [...updated.sessions, session];
  const newStats = { ...updated.questionStats };
  for (const r of session.results) {
    const existing = newStats[r.questionId] || { questionId: r.questionId, attempts: 0, correctCount: 0, lastAttempt: "", nextReview: null, srsLevel: 0 };
    const attempts = existing.attempts + 1;
    const correctCount = existing.correctCount + (r.isCorrect ? 1 : 0);
    let srsLevel = existing.srsLevel;
    let nextReview: string | null = null;
    if (r.isCorrect) { srsLevel = Math.min(existing.srsLevel + 1, 3); } else { srsLevel = 0; }
    const intervals = [1, 3, 7];
    if (srsLevel > 0 && srsLevel <= 3) { const d = new Date(); d.setDate(d.getDate() + intervals[srsLevel - 1]); nextReview = d.toISOString().split("T")[0]; }
    newStats[r.questionId] = { questionId: r.questionId, attempts, correctCount, lastAttempt: new Date().toISOString(), nextReview, srsLevel } as QuestionStats;
  }
  return { ...updated, sessions: newSessions, questionStats: newStats };
}
