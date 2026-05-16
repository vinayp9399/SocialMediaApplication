"use client";
import { Flame, Clock } from "lucide-react";

export function SortBar({ sort, onChange }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {[{ value: "popular", label: "Hot", Icon: Flame }, { value: "latest", label: "New", Icon: Clock }].map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-8 text-xs font-bold transition-all border ${
            sort === value ? "bg-ink-700 text-gold-400 border-ink-600" : "text-ink-500 border-transparent hover:bg-ink-800 hover:text-ink-200"
          }`}
        >
          <Icon size={13} /> {label}
        </button>
      ))}
    </div>
  );
}
