import { timeAgo } from "../../lib/utils";

export function CommentItem({ comment }) {
  return (
    <div className="flex gap-3 group py-3 border-t border-ink-800 first:border-t-0">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className="w-7 h-7 rounded-8 bg-ink-700 border border-ink-600 flex items-center justify-center text-xs font-bold text-gold-400">
          {comment.author.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 w-px bg-ink-800 mt-1" />
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-ink-200">{comment.author.username}</span>
          <span className="text-xs text-ink-600 font-mono">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-ink-300 leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-1 mt-2">
          {["↑ Vote", "Reply", "Share"].map((a) => (
            <button key={a} className="text-xs text-ink-600 hover:text-ink-300 px-2 py-1 rounded-4 hover:bg-ink-800 transition-colors">
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
