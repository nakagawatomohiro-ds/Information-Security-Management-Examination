interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "bg-brand-500" }: ProgressBarProps) {
  const pct = Math.min(Math.max(value, 0), 1) * 100;
  return (
    <div className="w-full h-2 bg-brand-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
