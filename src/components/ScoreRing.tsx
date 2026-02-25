"use client";

interface ScoreRingProps {
  score: number;
  label: string;
}

export function ScoreRing({ score, label }: ScoreRingProps) {
  const percentage = score / 1000;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  const getColor = () => {
    if (percentage >= 0.8) return "#247751";
    if (percentage >= 0.5) return "#339366";
    return "#55ae80";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e2f5ec"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 70 70)"
          className="transition-all duration-1000"
        />
        <text
          x="70"
          y="65"
          textAnchor="middle"
          className="text-2xl font-bold"
          fill="#163f2e"
          fontSize="28"
        >
          {score}
        </text>
        <text
          x="70"
          y="85"
          textAnchor="middle"
          fill="#64748b"
          fontSize="11"
        >
          / 1000
        </text>
      </svg>
      <span className="text-xs text-slate-500 mt-1">{label}</span>
    </div>
  );
}
