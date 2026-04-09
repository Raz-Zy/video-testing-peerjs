function clampStarDisplay(n) {
  const x = Math.floor(Number(n));
  if (Number.isNaN(x) || x < 1) return 0;
  return Math.min(5, x);
}

/** Renders API `star` (1–5 or null). */
export default function StarRatingDisplay({ star, className = "" }) {
  const filled = star == null || star === "" ? 0 : clampStarDisplay(star);
  return (
    <p
      className={`flex items-center gap-0.5 ${className}`}
      aria-label={filled > 0 ? `${filled} out of 5 stars` : "No rating yet"}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-sm leading-none ${n <= filled ? "text-amber-400" : "text-gray-200"}`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-xs tabular-nums text-gray-500">
        {filled > 0 ? filled : "—"}
      </span>
    </p>
  );
}
