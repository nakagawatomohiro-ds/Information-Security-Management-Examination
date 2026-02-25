"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserProgress, STAGES } from "@/types";
import { loadProgress } from "@/lib/storage";
import { getStageProgress, getStageAccuracy } from "@/lib/scoring";
import { ProgressBar } from "@/components/ProgressBar";

export default function StagesPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

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

  return (
    <div className="px-4 pt-6">
      <h1 className="text-xl font-bold text-brand-800 mb-2">ステージ一覧</h1>
      <p className="text-sm text-slate-500 mb-6">
        5つのステージで段階的に学習しましょう
      </p>

      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const prog = getStageProgress(progress, stage.id);
          const acc = getStageAccuracy(progress, stage.id);

          const stageSessions = progress.sessions.filter(
            (s) => s.stageId === stage.id
          );
          const bestScore =
            stageSessions.length > 0
              ? Math.max(...stageSessions.map((s) => s.score))
              : 0;

          return (
            <Link
              key={stage.id}
              href={`/quiz?stage=${stage.id}`}
              className="block bg-white rounded-2xl p-5 border border-brand-100 shadow-sm active:shadow-none active:bg-brand-50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stage.color} flex items-center justify-center text-2xl text-white shrink-0`}
                >
                  {stage.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-brand-400 font-medium">
                      STAGE {index + 1}
                    </span>
                    {prog >= 1 && (
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                        完了
                      </span>
                    )}
                  </div>
                  <h2 className="font-bold text-brand-800 mt-0.5">
                    {stage.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {stage.description}
                  </p>

                  <div className="mt-3">
                    <ProgressBar value={prog} color={stage.color} />
                  </div>

                  <div className="flex gap-4 mt-2">
                    <div className="text-xs text-slate-500">
                      到達度{" "}
                      <span className="font-medium text-brand-700">
                        {Math.round(prog * 100)}%
                      </span>
                    </div>
                    {acc > 0 && (
                      <div className="text-xs text-slate-500">
                        正答率{" "}
                        <span className="font-medium text-brand-700">
                          {Math.round(acc * 100)}%
                        </span>
                      </div>
                    )}
                    {bestScore > 0 && (
                      <div className="text-xs text-slate-500">
                        最高{" "}
                        <span className="font-medium text-amber-600">
                          {bestScore}点
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
