"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, FileText, ArrowUp } from "lucide-react";
import { timeAgo, formatCount } from "../../../lib/utils";
import api from "../../../lib/api";
import { Navbar } from "../../../components/layout/Navbar";

export default function ProfilePage({ params }) {
  const { username } = params;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [tab, setTab]         = useState("posts"); // "posts" | "comments"

  useEffect(() => {
    api.get(`/users/${username}`)
      .then((res) => setProfile(res.data.user))
      .catch((err) => setError(err.response?.data?.message || "User not found."))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10 animate-pulse space-y-4">
      <div className="h-24 skeleton rounded-12" />
      <div className="h-8 skeleton rounded w-1/3" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 skeleton rounded-8" />)}
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-20 text-center">
      <p className="text-rose-400 text-sm">{error}</p>
    </div>
  );

  const totalVotes = profile.posts.reduce((acc, p) => acc + (p._count?.votes ?? 0), 0);

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 mb-6 transition-colors">
        <ArrowLeft size={13} /> Back
      </Link>

      {/* Profile header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-12 bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-ink-950 font-display font-bold text-3xl flex-shrink-0">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-100">{profile.username}</h1>
            <p className="text-xs text-ink-500 mt-0.5">Member of Nexus</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-5 pt-5 border-t border-ink-800">
          <div>
            <p className="font-bold text-ink-100 text-sm font-mono">{profile.posts.length}</p>
            <p className="text-xs text-ink-500 flex items-center gap-1"><FileText size={10} /> Posts</p>
          </div>
          <div>
            <p className="font-bold text-ink-100 text-sm font-mono">{profile.comments.length}</p>
            <p className="text-xs text-ink-500 flex items-center gap-1"><MessageSquare size={10} /> Comments</p>
          </div>
          <div>
            <p className="font-bold text-ink-100 text-sm font-mono">{formatCount(totalVotes)}</p>
            <p className="text-xs text-ink-500 flex items-center gap-1"><ArrowUp size={10} /> Post votes</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-4">
        {[{ value: "posts", label: "Posts", count: profile.posts.length }, { value: "comments", label: "Comments", count: profile.comments.length }].map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-8 text-xs font-bold transition-all border ${
              tab === value ? "bg-ink-700 text-gold-400 border-ink-600" : "text-ink-500 border-transparent hover:bg-ink-800 hover:text-ink-200"
            }`}
          >
            {label}
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded-4 ${tab === value ? "bg-gold-500/20 text-gold-400" : "bg-ink-700 text-ink-500"}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {tab === "posts" && (
        <div className="space-y-3">
          {profile.posts.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-ink-500 text-sm">No posts yet.</p>
            </div>
          ) : profile.posts.map((post) => (
            <div key={post.id} className="card card-hover p-4">
              <div className="flex items-center gap-2 text-xs text-ink-500 mb-2">
                <Link href={`/r/${post.community.slug}`} className="font-bold text-ink-300 hover:text-gold-400 transition-colors">
                  {post.community.name}
                </Link>
                <span>·</span>
                <span className="font-mono">{timeAgo(post.createdAt)}</span>
              </div>
              <Link href={`/post/${post.id}`}>
                <h3 className="font-display text-sm font-semibold text-ink-100 hover:text-gold-300 transition-colors leading-snug mb-2">
                  {post.title}
                </h3>
              </Link>
              {post.content && (
                <p className="text-xs text-ink-500 line-clamp-2 mb-3">{post.content}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-ink-600 font-mono">
                <span className="flex items-center gap-1"><ArrowUp size={11} /> {post._count?.votes ?? 0}</span>
                <span className="flex items-center gap-1"><MessageSquare size={11} /> {post._count?.comments ?? 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comments tab */}
      {tab === "comments" && (
        <div className="space-y-3">
          {profile.comments.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-ink-500 text-sm">No comments yet.</p>
            </div>
          ) : profile.comments.map((comment) => (
            <div key={comment.id} className="card p-4">
              <div className="flex items-center gap-2 text-xs text-ink-500 mb-2">
                <span>On:</span>
                <Link href={`/post/${comment.post.id}`} className="font-semibold text-ink-300 hover:text-gold-400 transition-colors line-clamp-1">
                  {comment.post.title}
                </Link>
                <span className="flex-shrink-0 font-mono">· {timeAgo(comment.createdAt)}</span>
              </div>
              <p className="text-sm text-ink-300 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
