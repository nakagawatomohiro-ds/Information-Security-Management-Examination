"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserProgress, STAGES, StageId } from "@/types";
import { loadProgress } from "@/lib/storage";
import { calculateTotalScore, getStageProgress, getStageAccuracy, isPassingScore } from "@/lib/scoring";
import { getReviewCount } from "@/lib/quiz-engine";
import { ScoreRing } from "@/components/ScoreRing";
import { ProgressBar } from "@/components/ProgressBar";

export default function HomePage() {
    const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
        setProgress(loadProgress());
  }, []);

  if (!progress) {
        return (
                <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-pulse text-brand-400">読み込み中...</div>div>
                </div>div>
              );
  }
  
    const totalScore = calculateTotalScore(progress);
    const reviewCount = getReviewCount(progress);
    const passing = isPassingScore(progress);
  
    const stageProgressList = STAGES.map((s) => ({
          ...s,
          progress: getStageProgress(progress, s.id),
          accuracy: getStageAccuracy(progress, s.id),
    }));
  
    const recommended = stageProgressList.reduce((a, b) =>
          a.progress < b.progress ? a : b
        );
  
    const lastSession = progress.sessions[progress.sessions.length - 1];
  
    return (
          <div className="px-4 pt-0">
            {/* Branded Header */}
                <div className="bg-gradient-to-r from-brand-800 to-brand-700 -mx-4 px-5 pt-8 pb-6 mb-6 rounded-b-3xl shadow-lg">
                        <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                            <span className="text-xl">💧</span>span>
                                              </div>div>
                                              <div>
                                                            <h1 className="text-lg font-bold text-white tracking-wide">DSCSS</h1>h1>
                                                            <p className="text-xs text-brand-200">情報セキュリティマネジメント</p>p>
                                              </div>div>
                                  </div>div>
                                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                              <span className="text-lg">🔥</span>span>
                                              <span className="text-sm font-bold text-white">
                                                {progress.streak}日連続
                                              </span>span>
                                  </div>div>
                        </div>div>
                </div>div>
          
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-100 mb-6">
                        <div className="flex items-center justify-center relative">
                                  <ScoreRing score={totalScore} label="総合スコア" />
                        </div>div>
                  {passing ? (
                      <div className="mt-4 text-center bg-brand-50 rounded-xl py-2 px-4">
                                  <span className="text-brand-700 font-bold text-sm">
                                                🎉 合格圏到達！
                                  </span>span>
                      </div>div>
                    ) : (
                      <div className="mt-4 text-center">
                                  <p className="text-xs text-slate-500">
                                                合格圏まであと <span className="font-bold text-brand-600">{Math.max(0, 800 - totalScore)}点</span>span>
                                  </p>p>
                      </div>div>
                        )}
                </div>div>
          
                <div className="grid grid-cols-2 gap-3 mb-6">
                        <Link
                                    href={`/quiz?stage=${recommended.id}`}
                                    className="bg-brand-700 text-white rounded-2xl p-4 active:bg-brand-800 transition-colors shadow-sm"
                                  >
                                  <div className="text-xs opacity-80 mb-1">今日のおすすめ</div>div>
                                  <div className="font-bold text-sm">{recommended.icon} {recommended.name}</div>div>
                                  <div className="text-xs opacity-80 mt-1">
                                              到達度 {Math.round(recommended.progress * 100)}%
                                  </div>div>
                        </Link>Link>
                
                  {lastSession ? (
                      <Link
                                    href={`/quiz?stage=${lastSession.stageId}`}
                                    className="bg-white border border-brand-200 rounded-2xl p-4 active:bg-brand-50 transition-colors"
                                  >
                                  <div className="text-xs text-slate-500 mb-1">続きから</div>div>
                                  <div className="font-bold text-sm text-brand-800">
                                    {STAGES.find((s) => s.id === lastSession.stageId)?.icon}{" "}
                                    {STAGES.find((s) => s.id === lastSession.stageId)?.name}
                                  </div>div>
                                  <div className="text-xs text-slate-500 mt-1">
                                                前回 {Math.round((lastSession.results.filter((r) => r.isCorrect).length / lastSession.results.length) * 100)}%正解
                                  </div>div>
                      </Link>Link>
                    ) : (
                      <Link
                                    href="/stages"
                                    className="bg-white border border-brand-200 rounded-2xl p-4 active:bg-brand-50 transition-colors"
                                  >
                                  <div className="text-xs text-slate-500 mb-1">はじめる</div>div>
                                  <div className="font-bold text-sm text-brand-800">📋 ステージ選択</div>div>
                                  <div className="text-xs text-slate-500 mt-1">5つのステージ</div>div>
                      </Link>Link>
                        )}
                </div>div>
          
            {reviewCount > 0 && (
                    <Link
                                href="/review"
                                className="block bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 active:bg-amber-100 transition-colors"
                              >
                              <div className="flex items-center justify-between">
                                          <div>
                                                        <div className="font-bold text-sm text-amber-800">
                                                                        🔄 復習すべき問題があります
                                                        </div>div>
                                                        <div className="text-xs text-amber-600 mt-0.5">
                                                          {reviewCount}問が復習対象です
                                                        </div>div>
                                          </div>div>
                                          <span className="text-amber-400 text-xl">→</span>span>
                              </div>div>
                    </Link>Link>
                )}
          
                <h2 className="text-sm font-bold text-brand-800 mb-3">ステージ一覧</h2>h2>
                <div className="space-y-3 mb-8">
                  {stageProgressList.map((stage) => (
                      <Link
                                    key={stage.id}
                                    href={`/quiz?stage=${stage.id}`}
                                    className="block bg-white rounded-xl p-4 border border-brand-100 active:bg-brand-50 transition-colors"
                                  >
                                  <div className="flex items-center gap-3">
                                                <span className="text-2xl">{stage.icon}</span>span>
                                                <div className="flex-1 min-w-0">
                                                                <div className="font-medium text-sm text-brand-800">
                                                                  {stage.name}
                                                                </div>div>
                                                                <div className="mt-1.5">
                                                                                  <ProgressBar value={stage.progress} color={stage.color} />
                                                                </div>div>
                                                                <div className="flex justify-between mt-1">
                                                                                  <span className="text-xs text-slate-500">
                                                                                                      到達度 {Math.round(stage.progress * 100)}%
                                                                                    </span>span>
                                                                  {stage.accuracy > 0 && (
                                                        <span className="text-xs text-slate-500">
                                                                              正答率 {Math.round(stage.accuracy * 100)}%
                                                        </span>span>
                                                                                  )}
                                                                </div>div>
                                                </div>div>
                                  </div>div>
                      </Link>Link>
                    ))}
                </div>div>
          </div>div>
        );
}</div>
