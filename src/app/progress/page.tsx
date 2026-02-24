"use client";

import { useEffect, useState } from "react";
import { UserProgress, STAGES } from "@/types";
import { loadProgress } from "@/lib/storage";
import {
  calculateTotalScore,
  getStageProgress,
  getStageAccuracy,
  getTagAccuracy,
  isPassingScore,
} from "@/lib/scoring";
import { ScoreRing } from "@/components/ScoreRing";
import { ProgressBar } from "@/components/ProgressBar";

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

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

  const totalScore = calculateTotalScore(progress);
  const passing = isPassingScore(progress);
  const tagAccuracy = getTagAccuracy(progress);

  const sortedTags = Object.entries(tagAccuracy).sort(
    (a, b) => a[1].rate - b[1].rate
  );

  const recentSessions = progress.sessions.slice(-10);

  const totalQuestions = Object.values(progress.questionStats).filter(
    (s) => s.attempts > 0
  ).length;
  const totalSessions = progress.sessions.length;

  return (
    <div className="px-4 pt-6 pb-24">
      <h1 className="text-xl font-bold text-slate-800 mb-6">学習進捗</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex justify-center relative">
          <ScoreRing score={totalScore} label="総合スコア" />
        </div>
        {passing ? (
          <div className="mt-4 text-center bg-green-50 rounded-xl py-3 px-4">
            <span className="text-green-700 font-bold">🎉 合格圏到達！</span>
            <p className="text-xs text-green-600 mt-1">
              全ステージ70%以上 & 800点以上達成
            </p>
          </div>
        ) : (
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              合格判定: 総合800点以上 & 全ステージ70%以上
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
          <div className="text-xl font-bold text-slate-800">{totalSessions}</div>
          <div className="text-xs text-slate-500">セッション数</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
          <div className="text-xl font-bold text-slate-800">{totalQuestions}</div>
          <div className="text-xs text-slate-500">学習済み問題</div>
        </div>
        <div className="bg-white rounded-xl p-3 text-center border border-slate-100">
          <div className="text-xl font-bold text-amber-600">
            {progress.streak}日
          </div>
          <div className="text-xs text-slate-500">連続学習</div>
        </div>
      </div>

      {recentSessions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-4">
            スコア推移（直近{recentSessions.length}回）
          </h2>
          <div className="flex items-end gap-1 h-24">
            {recentSessions.map((session, i) => {
              const height = (session.score / 1000) * 100;
              return (
                <div
                  key={session.id}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-slate-400">
                    {session.score}
                  </span>
                  <div
                    className={\`w-full rounded-t \${
                      session.score >= 800 ? "bg-green-400" : "bg-blue-400"
                    }\`}
                    style={{ height: \`\${Math.max(height, 4)}%\` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="relative -mt-[80%] mb-[60%] ml-0 mr-0">
            <div className="border-t border-dashed border-green-300 absolute w-full" style={{ bottom: "80%" }} />
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-sm font-bold text-slate-700 mb-3">
          ステージ別習熟度
        </h2>
        <div className="space-y-3">
          {STAGES.map((stage) => {
            const prog = getStageProgress(progress, stage.id);
            const acc = getStageAccuracy(progress, stage.id);

            return (
              <div
                key={stage.id}
                className="bg-white rounded-xl p-4 border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{stage.icon}</span>
                  <span className="font-medium text-sm text-slate-800">
                    {stage.name}
                  </span>
                  {acc >= 0.7 && prog >= 0.5 && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                <ProgressBar value={prog} color={stage.color} />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-500">
                    到達度 {Math.round(prog * 100)}%
                  </span>
                  <span
                    className={\`text-xs font-medium \${
                      acc >= 0.7
                        ? "text-green-600"
                        : acc >= 0.5
                        ? "text-amber-600"
                        : acc > 0
                        ? "text-red-600"
                        : "text-slate-400"
                    }\`}
                  >
                    正答率 {acc > 0 ? \`\${Math.round(acc * 100)}%\` : "---"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {sortedTags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-3">
            タグ別弱点分析
          </h2>
          <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
            {sortedTags.map(([tag, data]) => (
              <div key={tag} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={\`w-2 h-2 rounded-full \${
                      data.rate < 0.3
                        ? "bg-red-500"
                        : data.rate < 0.5
                        ? "bg-amber-500"
                        : data.rate < 0.7
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }\`}
                  />
                  <span className="text-sm text-slate-700">{tag}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {data.correct}/{data.total}
                  </span>
                  <span
                    className={\`text-sm font-medium min-w-[40px] text-right \${
                      data.rate < 0.5 ? "text-red-600" : "text-slate-700"
                    }\`}
                  >
                    {Math.round(data.rate * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalSessions === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            まだデータがありません
          </h2>
          <p className="text-sm text-slate-500">
            クイズを解くと進捗が表示されます
          </p>
        </div>
      )}
    </div>
  );
}
