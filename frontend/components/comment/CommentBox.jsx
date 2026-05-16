"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function CommentBox({ onSubmit }) {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    await onSubmit(value.trim());
    setValue("");
    setLoading(false);
  };

  return (
    <form onSubmit={handle} className="mb-6">
      <p className="text-xs text-ink-500 mb-2">
        Commenting as <span className="text-gold-400 font-semibold">{user?.username ?? "guest"}</span>
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Share your thoughts..."
        rows={4}
        className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none resize-none transition-colors"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="h-8 px-4 bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed text-ink-950 text-xs font-bold rounded-8 transition-colors"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
