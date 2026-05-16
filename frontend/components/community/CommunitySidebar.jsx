"use client";
import Link from "next/link";
import { Users, Calendar, Shield } from "lucide-react";
import { useCommunities } from "../../context/CommunitiesContext";
import { formatCount, COLORS } from "../../lib/utils";

export function CommunitySidebar({ slug }) {
  const { communities, getCommunityBySlug, toggleJoin } = useCommunities();
  const community = getCommunityBySlug(slug);
  if (!community) return null;

  const idx = communities.findIndex((c) => c.slug === slug);
  const color = COLORS[idx % COLORS.length];

  return (
    <aside className="space-y-4">
      <div className="card overflow-hidden">
        <div className={`h-16 bg-gradient-to-r ${color}`}>
          <div className="h-full w-full bg-ink-950/40" />
        </div>
        <div className="px-4 pb-4 -mt-5 relative">
          <div className={`w-10 h-10 rounded-12 bg-gradient-to-br ${color} flex items-center justify-center text-ink-950 font-display font-bold text-lg mb-3 border-2 border-ink-900`}>
            {community.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-display font-semibold text-ink-100 mb-1">{community.name}</h2>
          <p className="text-xs text-ink-400 leading-relaxed mb-4">{community.description || "No description yet."}</p>

          <div className="flex gap-5 mb-4 py-3 border-y border-ink-800">
            <div>
              <p className="font-bold text-ink-100 text-sm font-mono">{formatCount(community._count?.posts ?? 0)}</p>
              <p className="text-xs text-ink-500 flex items-center gap-1"><Users size={10} /> Posts</p>
            </div>
          </div>

          <p className="text-xs text-ink-500 flex items-center gap-1.5 mb-4">
            <Calendar size={11} />
            Created {new Date(community.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <div className="space-y-2">
            <Link href={`/submit?community=${community.slug}`} className="flex items-center justify-center w-full h-9 bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-bold rounded-8 transition-colors">
              Post to Community
            </Link>
            <button
              onClick={() => toggleJoin(community.id)}
              className={`w-full h-9 text-xs font-bold rounded-8 border transition-all ${
                community.joined
                  ? "bg-gold-500/10 text-gold-400 border-gold-500/30 hover:bg-gold-500/20"
                  : "border-ink-600 text-ink-300 hover:border-gold-500/40 hover:text-gold-400"
              }`}
            >
              {community.joined ? "✓ Joined" : "Join Community"}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-xs font-bold text-ink-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Shield size={11} /> Rules
        </h3>
        {["Be respectful", "No spam", "Stay on topic", "Follow platform guidelines"].map((rule, i) => (
          <div key={i} className="flex gap-2 py-2 border-t border-ink-800 text-xs text-ink-400">
            <span className="font-mono text-ink-600">{i + 1}.</span> {rule}
          </div>
        ))}
      </div>
    </aside>
  );
}
