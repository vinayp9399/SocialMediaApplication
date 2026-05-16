"use client";
import Link from "next/link";
import { MessageSquare, Share2, Bookmark } from "lucide-react";
import { VoteButtons } from "../../components/vote/VoteButtons";
import { timeAgo } from "../../lib/utils";

export function PostCard({ post }) {
  return (
    <article className="card card-hover flex overflow-hidden group">
      <VoteButtons postId={post.id} score={post.voteScore} userVote={post.userVote} />

      <div className="flex-1 min-w-0 px-3 py-3">
        {/* Meta */}
        <div className="flex items-center gap-1.5 text-xs text-ink-500 mb-2 flex-wrap">
          <Link href={`/r/${post.community.slug}`} onClick={(e) => e.stopPropagation()} className="font-bold text-ink-300 hover:text-gold-400 transition-colors">
            {post.community.name}
          </Link>
          <span>·</span>
          <span>{post.author.username}</span>
          <span>·</span>
          <span className="font-mono">{timeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <Link href={`/post/${post.id}`}>
          <h2 className="font-display text-base font-semibold text-ink-100 leading-snug mb-2 group-hover:text-gold-300 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Image */}
        {post.imageUrl && (
          <div className="w-full rounded-8 overflow-hidden mb-2 border border-ink-700 max-h-56">
            <img src={post.imageUrl} alt={post.title} className="w-full object-cover max-h-56" />
          </div>
        )}

        {/* Content preview */}
        {!post.imageUrl && post.content && (
          <p className="text-sm text-ink-400 line-clamp-2 mb-2">{post.content}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-0.5 mt-1">
          <Link href={`/post/${post.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-8 text-xs font-medium text-ink-500 hover:bg-ink-800 hover:text-ink-200 transition-colors">
            <MessageSquare size={13} /> {post.commentCount}
          </Link>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-8 text-xs font-medium text-ink-500 hover:bg-ink-800 hover:text-ink-200 transition-colors">
            <Share2 size={13} /> Share
          </button>
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-8 text-xs font-medium text-ink-500 hover:bg-ink-800 hover:text-ink-200 transition-colors">
            <Bookmark size={13} /> Save
          </button>
        </div>
      </div>
    </article>
  );
}
