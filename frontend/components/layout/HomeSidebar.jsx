"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCommunities } from "../../context/CommunitiesContext";
import { formatCount, COLORS } from "../../lib/utils";

export function HomeSidebar() {
  const { communities, toggleJoin } = useCommunities();
  const top = communities.slice(0, 5);

  return (
    <aside className="space-y-4">
      {/* Create panel */}
      <div className="card p-5">
        <h2 className="font-display text-base font-semibold text-ink-100 mb-1">Start a Conversation</h2>
        <p className="text-xs text-ink-500 mb-4">Share ideas and contribute to communities you care about.</p>
        <div className="space-y-2">
          <Link href="/submit" className="flex items-center justify-center gap-2 w-full h-9 bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-bold rounded-8 transition-colors">
            <Plus size={14} strokeWidth={2.5} /> New Post
          </Link>
          <Link href="/create-community" className="flex items-center justify-center w-full h-9 border border-ink-600 text-ink-300 text-xs font-semibold rounded-8 hover:border-ink-400 hover:text-ink-100 transition-colors">
            Create Community
          </Link>
        </div>
      </div>

      {/* Top Communities */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest">Top Communities</h3>
          <Link href="/communities" className="text-xs text-gold-500 hover:text-gold-400">See all</Link>
        </div>
        <div className="space-y-1">
          {top.map((c, i) => (
            <div key={c.id} className="flex items-center gap-3 p-2 rounded-8 hover:bg-ink-800 transition-colors">
              <span className="text-xs font-mono text-ink-600 w-4">{String(i + 1).padStart(2, "0")}</span>
              <div className={`w-7 h-7 rounded-8 bg-gradient-to-br ${COLORS[i % COLORS.length]} flex-shrink-0 flex items-center justify-center text-ink-950 font-bold text-xs`}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/r/${c.slug}`} className="text-xs font-semibold text-ink-200 hover:text-gold-300 block truncate transition-colors">
                  {c.name}
                </Link>
                <p className="text-xs text-ink-600">{formatCount(c._count?.posts ?? 0)} posts</p>
              </div>
              <button
                onClick={() => toggleJoin(c.id)}
                className={`text-xs font-bold px-2 py-1 rounded-4 border transition-all flex-shrink-0 ${
                  c.joined ? "bg-gold-500/20 text-gold-400 border-gold-500/40" : "border-ink-600 text-ink-400 hover:border-gold-500/40 hover:text-gold-400"
                }`}
              >
                {c.joined ? "✓" : "+"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-700 px-1">Privacy · Terms · Help — Nexus © 2024</p>
    </aside>
  );
}
