"use client";
import { ArrowUp, ArrowDown } from "lucide-react";
import { usePosts } from "../../context/PostsContext";
import { formatCount } from "../../lib/utils";

export function VoteButtons({ postId, score, userVote }) {
  const { vote } = usePosts();

  const handle = (e, type) => {
    e.stopPropagation();
    vote(postId, type);
  };

  return (
    <div className="flex flex-col items-center gap-0 w-10 py-3 flex-shrink-0">
      <button
        onClick={(e) => handle(e, "up")}
        className={`w-7 h-7 flex items-center justify-center rounded-8 transition-all ${
          userVote === "up" ? "bg-gold-500/20 text-gold-400" : "text-ink-500 hover:bg-ink-700 hover:text-gold-400"
        }`}
      >
        <ArrowUp size={15} strokeWidth={2.5} />
      </button>
      <span className={`text-xs font-bold font-mono py-0.5 ${
        userVote === "up" ? "text-gold-400" : userVote === "down" ? "text-rose-400" : "text-ink-300"
      }`}>
        {formatCount(score)}
      </span>
      <button
        onClick={(e) => handle(e, "down")}
        className={`w-7 h-7 flex items-center justify-center rounded-8 transition-all ${
          userVote === "down" ? "bg-rose-500/20 text-rose-400" : "text-ink-500 hover:bg-ink-700 hover:text-rose-400"
        }`}
      >
        <ArrowDown size={15} strokeWidth={2.5} />
      </button>
    </div>
  );
}
