"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserProgress } from "@/types";
import { loadProgress } from "@/lib/storage";
import { getReviewCount } from "@/lib/quiz-engine";
import questions from "@/data/questions.json";

export default function ReviewPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const router = useRouter();

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-slate-400">読み込み中...</div>
      </div>
    );
  }

  const reviewCount = getReviewCount(progress);
  const today = new Date().toISOString().split("T")[0];

  const srsDue: typeof questions = [];
  const lowAccuracy: typeof questions = [];
  const allQs = questions;

  for (const q of allQs) {
    const stat = progress.questionStats[q.id];
    if (!stat || stat.attempts === 0) continue;

    if (stat.nextReview && stat.nextReview <= today) {
      srsDue.push(q);
    } else if (stat.correctCount / stat.attempts < 0.5) {
      lowAccuracy.push(q);
    }
  }

  return (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-slate-800 mb-2">復習モード</h1>
      <p className="text-sm text-slate-500 mb-6">
        間違えた問題・正答率の低い問題を優先的に出題します
      </p>

      {reviewCount > 0 ? (
        <>
          <Link
            href="/quiz?stage=review"
            className="block bg-blue-600 text-white font-bold py-4 rounded-2xl text-center active:bg-blue-700 transition-colors mb-6"
          >
            🔄 復習を始める（{reviewCount}問）
          </Link>

          {srsDue.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-700 mb-3">
                📅 復習時期の問題（{srsDue.length}問）
              </h2>
              <div className="space-y-2">
                {srsDue.slice(0, 5).map((q) => {
                  const stat = progress.questionStats[q.id];
                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl p-3 border border-slate-100"
                    >
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {q.body}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {q.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {stat && (
                          <span className="text-xs text-amber-600">
                            正答率 {Math.round((stat.correctCount / stat.attempts) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {srsDue.length > 5 && (
                  <p className="text-xs text-slate-400 text-center">
                    他 {srsDue.length - 5} 問
                  </p>
                )}
              </div>
            </div>
          )}

          {lowAccuracy.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-bold text-slate-700 mb-3">
                ⚠️ 正答率が低い問題（{lowAccuracy.length}問）
              </h2>
              <div className="space-y-2">
                {lowAccuracy.slice(0, 5).map((q) => {
                  const stat = progress.questionStats[q.id];
                  return (
                    <div
                      key={q.id}
                      className="bg-white rounded-xl p-3 border border-slate-100"
                    >
                      <p className="text-sm text-slate-700 line-clamp-2">
                        {q.body}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {q.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {stat && (
                          <span className="text-xs text-red-600">
                            正答率 {Math.round((stat.correctCount / stat.attempts) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {lowAccuracy.length > 5 && (
                  <p className="text-xs text-slate-400 text-center">
                    他 {lowAccuracy.length - 5} 問
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            復習すべき問題はありません
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            まずはステージから学習を始めましょう
          </p>
          <Link
            href="/stages"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-xl active:bg-blue-700 transition-colors"
          >
            ステージ一覧へ
          </Link>
        </div>
      )}
    </div>
  );
}
