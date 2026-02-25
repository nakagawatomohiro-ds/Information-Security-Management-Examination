"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { STAGES, UserProgress } from "@/types";
import { loadProgress } from "@/lib/storage";
import { ScoreRing } from "@/components/ScoreRing";
import { getTagAccuracy, calculateTotalScore } from "@/lib/scoring";
import questions from "@/data/questions.json";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const time = parseInt(searchParams.get("time") || "0");
  const stageId = searchParams.get("stage") || "basics";
  const sessionId = searchParams.get("sessionId") || "";

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-brand-400">読み込み中...</div>
      </div>
    );
  }

  const session = progress.sessions.find((s) => s.id === sessionId);
  const wrongResults = session?.results.filter((r) => !r.isCorrect) || [];
  const stageName =
    stageId === "review"
      ? "復習モード"
      : STAGES.find((s) => s.id === stageId)?.name || "";

  const formatTime = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const totalScore = calculateTotalScore(progress);
  const tagAccuracy = getTagAccuracy(progress);
  const weakTags = Object.entries(tagAccuracy)
    .filter(([, v]) => v.rate < 0.5)
    .sort((a, b) => a[1].rate - b[1].rate)
    .slice(0, 5);

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-brand-800">セッション結果</h1>
        <p className="text-sm text-slate-500 mt-1">{stageName}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 mb-6">
        <div className="flex justify-center relative">
          <ScoreRing score={score} label="セッションスコア" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-800">
              {correct}/{total}
            </div>
            <div className="text-xs text-slate-500 mt-1">正答数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-800">
              {Math.round((correct / total) * 100)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">正答率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-800">
              {formatTime(time)}
            </div>
            <div className="text-xs text-slate-500 mt-1">所要時間</div>
          </div>
        </div>
      </div>

      <div className="bg-brand-50 rounded-2xl p-4 border border-brand-200 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-brand-800">
            総合スコア
          </span>
          <span className="text-lg font-bold text-brand-700">
            {totalScore} / 1000
          </span>
        </div>
      </div>

      {wrongResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-brand-700 mb-3">
            間違えた問題 ({wrongResults.length}問)
          </h2>
          <div className="space-y-3">
            {wrongResults.map((r) => {
              const q = questions.find((qq) => qq.id === r.questionId);
              if (!q) return null;
              return (
                <div
                  key={r.questionId}
                  className="bg-white rounded-xl p-4 border border-brand-100"
                >
                  <p className="text-sm text-brand-800 font-medium mb-2">
                    {q.body}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      あなた: {q.choices[r.selectedIndex]?.text}
                    </span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      正解: {q.choices[r.correctIndex]?.text}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-brand-700 mb-3">
            弱点タグ分析
          </h2>
          <div className="bg-white rounded-xl p-4 border border-brand-100">
            {weakTags.map(([tag, data]) => (
              <div
                key={tag}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <span className="text-sm text-slate-700">{tag}</span>
                <span
                  className={`text-sm font-medium ${
                    data.rate < 0.3 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {Math.round(data.rate * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href={`/quiz?stage=${stageId}`}
          className="block w-full bg-brand-700 text-white font-bold py-4 rounded-2xl text-center active:bg-brand-800 transition-colors"
        >
          もう一度チャレンジ
        </Link>
        <Link
          href="/"
          className="block w-full bg-white text-brand-700 font-bold py-4 rounded-2xl text-center border border-brand-200 active:bg-brand-50 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-brand-400">読み込み中...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { STAGES, UserProgress } from "@/types";
import { loadProgress } from "@/lib/storage";
import { ScoreRing } from "@/components/ScoreRing";
import { getTagAccuracy, calculateTotalScore } from "@/lib/scoring";
import questions from "@/data/questions.json";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const score = parseInt(searchParams.get("score") || "0");
  const correct = parseInt(searchParams.get("correct") || "0");
  const total = parseInt(searchParams.get("total") || "0");
  const time = parseInt(searchParams.get("time") || "0");
  const stageId = searchParams.get("stage") || "basics";
  const sessionId = searchParams.get("sessionId") || "";

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

  const session = progress.sessions.find((s) => s.id === sessionId);
  const wrongResults = session?.results.filter((r) => !r.isCorrect) || [];
  const stageName =
    stageId === "review"
      ? "復習モード"
      : STAGES.find((s) => s.id === stageId)?.name || "";

  const formatTime = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const totalScore = calculateTotalScore(progress);
  const tagAccuracy = getTagAccuracy(progress);
  const weakTags = Object.entries(tagAccuracy)
    .filter(([, v]) => v.rate < 0.5)
    .sort((a, b) => a[1].rate - b[1].rate)
    .slice(0, 5);

  return (
    <div className="px-4 pt-6 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-slate-800">セッション結果</h1>
        <p className="text-sm text-slate-500 mt-1">{stageName}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-center relative">
          <ScoreRing score={score} label="セッションスコア" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {correct}/{total}
            </div>
            <div className="text-xs text-slate-500 mt-1">正答数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {Math.round((correct / total) * 100)}%
            </div>
            <div className="text-xs text-slate-500 mt-1">正答率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {formatTime(time)}
            </div>
            <div className="text-xs text-slate-500 mt-1">所要時間</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-800">
            総合スコア
          </span>
          <span className="text-lg font-bold text-blue-700">
            {totalScore} / 1000
          </span>
        </div>
      </div>

      {wrongResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3">
            間違えた問題 ({wrongResults.length}問)
          </h2>
          <div className="space-y-3">
            {wrongResults.map((r) => {
              const q = questions.find((qq) => qq.id === r.questionId);
              if (!q) return null;
              return (
                <div
                  key={r.questionId}
                  className="bg-white rounded-xl p-4 border border-slate-100"
                >
                  <p className="text-sm text-slate-800 font-medium mb-2">
                    {q.body}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                      あなた: {q.choices[r.selectedIndex]?.text}
                    </span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                      正解: {q.choices[r.correctIndex]?.text}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3">
            弱点タグ分析
          </h2>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            {weakTags.map(([tag, data]) => (
              <div
                key={tag}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <span className="text-sm text-slate-700">{tag}</span>
                <span
                  className={`text-sm font-medium ${
                    data.rate < 0.3 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {Math.round(data.rate * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <Link
          href={`/quiz?stage=${stageId}`}
          className="block w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-center active:bg-blue-700 transition-colors"
        >
          もう一度チャレンジ
        </Link>
        <Link
          href="/"
          className="block w-full bg-white text-slate-700 font-bold py-4 rounded-2xl text-center border border-slate-200 active:bg-slate-50 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-slate-400">読み込み中...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
