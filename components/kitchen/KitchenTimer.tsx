"use client";

import { useEffect, useState } from "react";

function getMinutesSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / 60000);
}

function getColorClass(minutes: number): string {
  if (minutes <= 10) return "text-green-700 bg-green-50";
  if (minutes <= 20) return "text-yellow-700 bg-yellow-50";
  return "text-red-700 bg-red-50";
}

export default function KitchenTimer({ since }: { since: Date }) {
  const [minutes, setMinutes] = useState(() => getMinutesSince(since));

  useEffect(() => {
    // Recompute every 30s — cheap, and keeps the color threshold
    // accurate without needing a full page refresh.
    const interval = setInterval(() => {
      setMinutes(getMinutesSince(since));
    }, 30_000);

    return () => clearInterval(interval);
  }, [since]);

  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${getColorClass(minutes)}`}
    >
      {minutes} min
    </span>
  );
}