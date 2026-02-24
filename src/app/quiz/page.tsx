"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  UserProgress,
  StageId,
  ShuffledQuestion,
  QuestionResult,
  SessionResult,
  STAGES,
} from "@/types";
import { loadProgress, saveProgress, addSessionResult } from "@/lib/storage";
import { selectQuestions } from "@/lib/quiz-engine";
import { calculateSessionScore } from "@/lib/scoring";

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stageId = (searchParams.get("stage") || "basics") as StageId | "review";

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [questions, setQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [sessionStartTime] = useState(Date.now());
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    const qs = selectQuestions(stageId, p, 10);
    if (qs.length === 0) {
      router.push("/stages");
      return;
    }
    setQuestions(qs);
    setQuestionStartTime(Date.now());
  }, [stageId, router]);

  const currentQ = questions[currentIndex];
  const stageName =
    stageId === "review"
      ? "å¾©ç¿ã¢ã¼ã"
      : STAGES.find((s) => s.id === stageId)?.name || "";

  const correctIndex = currentQ
    ? currentQ.choices.findIndex((c) => c.id === currentQ.correct)
    : -1;

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return;
      setSelectedIndex(index);
      setShowExplanation(true);
      const timeSpent = Date.now() - questionStartTime;
      const ci = currentQ.choices.findIndex((c) => c.id === currentQ.correct);
      const result: QuestionResult = {
        questionId: currentQ.id,
        selectedIndex: index,
        correctIndex: ci,
        isCorrect: currentQ.choices[index].id === currentQ.correct,
        timeSpent,
      };
      setResults((prev) => [...prev, result]);
    },
    [selectedIndex, questionStartTime, currentQ]
  );

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedIndex(null);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
  }, [currentIndex, questions.length]);

  useEffect(() => {
    if (!finished || !progress) return;
    const resolvedStageId: StageId =
      stageId === "review" ? "basics" : stageId;
    const session: SessionResult = {
      id: `session-${Date.now()}`,
      stageId: resolvedStageId,
      date: new Date().toISOString(),
      results,
      score: calculateSessionScore({
        id: "",
        stageId: resolvedStageId,
        date: "",
        results,
        score: 0,
        totalTime: 0,
      }),
      totalTime: Date.now() - sessionStartTime,
    };
    const newProgress = addSessionResult(progress, session);
    saveProgress(newProgress);

    const params = new URLSearchParams({
      score: session.score.toString(),
      correct: results.filter((r) => r.isCorrect).length.toString(),
      total: results.length.toString(),
      time: session.totalTime.toString(),
      stage: stageId,
      sessionId: session.id,
    });
    router.push(`/results?${params.toString()}`);
  }, [finished, progress, results, stageId, sessionStartTime, router]);

  if (!currentQ || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-slate-400">æºåä¸­...</div>
      </div>
    );
  }

  const progressPct = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.back()}
            className="text-slate-500 text-sm active:text-slate-700 p-1"
          >
            â çµäº
          </button>
          <span className="text-sm font-medium text-slate-600">{stageName}</span>
          <span className="text-sm text-slate-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                currentQ.difficulty === 1
                  ? "bg-green-100 text-green-700"
                  : currentQ.difficulty === 2
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {currentQ.difficulty === 1
                ? "åºæ¬"
                : currentQ.difficulty === 2
                ? "æ¨æº"
                : "å¿ç¨"}
            </span>
            {currentQ.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-base font-medium text-slate-800 leading-relaxed">
            {currentQ.body}
          </p>
        </div>

        <div className="space-y-3">
          {currentQ.choices.map((choice, i) => {
            const isCorrectChoice = choice.id === currentQ.correct;
            let style = "bg-white border-slate-200 text-slate-700";
            if (selectedIndex !== null) {
              if (isCorrectChoice) {
                style = "bg-green-50 border-green-400 text-green-800";
              } else if (i === selectedIndex && !isCorrectChoice) {
                style = "bg-red-50 border-red-400 text-red-800";
              } else {
                style = "bg-slate-50 border-slate-200 text-slate-400";
              }
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleSelect(i)}
                disabled={selectedIndex !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[52px] ${style} ${
                  selectedIndex === null
                    ? "active:border-blue-400 active:bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${
                      selectedIndex !== null && isCorrectChoice
                        ? "border-green-500 bg-green-500 text-white"
                        : selectedIndex === i && !isCorrectChoice
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5">
                    {choice.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-blue-700">
                {selectedIndex !== null &&
                currentQ.choices[selectedIndex].id === currentQ.correct
                  ? "â­ æ­£è§£ï¼"
                  : "â ä¸æ­£è§£"}
              </span>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="px-4 pb-6 pt-2">
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl active:bg-blue-700 transition-colors text-base"
          >
            {currentIndex >= questions.length - 1
              ? "çµæãè¦ã"
              : "æ¬¡ã®åé¡ã¸"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-slate-400">æºåä¸­...</div>
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
