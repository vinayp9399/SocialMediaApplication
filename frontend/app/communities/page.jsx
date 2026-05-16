"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Users } from "lucide-react";
import { useCommunities } from "../../context/CommunitiesContext";
import { formatCount, COLORS } from "../../lib/utils";
import { Navbar }       from "../../components/layout/Navbar";

export default function CommunitiesPage() {
  const { communities, loading, error, toggleJoin } = useCommunities();
  const [search, setSearch] = useState("");

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Navbar />
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-100 mb-2">
          Explore <span className="text-gold-gradient italic">Communities</span>
        </h1>
        <p className="text-sm text-ink-500">Find your people. Join the conversation.</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search communities..."
            className="w-full h-10 bg-ink-800 border border-ink-700 rounded-8 pl-9 pr-4 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-gold-500/40 transition-colors"
          />
        </div>
        <Link href="/create-community" className="flex items-center gap-1.5 h-10 px-4 bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-bold rounded-8 transition-colors flex-shrink-0">
          <Plus size={14} strokeWidth={2.5} /> Create
        </Link>
      </div>

      {loading && Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card p-4 flex items-center gap-4 mb-2 animate-pulse">
          <div className="w-6 h-3 skeleton rounded" />
          <div className="w-11 h-11 skeleton rounded-12" />
          <div className="flex-1 space-y-2"><div className="h-3 skeleton rounded w-1/3" /><div className="h-3 skeleton rounded w-1/4" /></div>
        </div>
      ))}

      {error && <p className="text-sm text-rose-400 text-center py-8">{error}</p>}

      {!loading && !error && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-ink-500 text-sm">{search ? `No results for "${search}"` : "No communities yet."}</p>
            </div>
          ) : filtered.map((c, i) => (
            <div key={c.id} className="card card-hover flex items-center gap-4 p-4">
              <span className="text-xs font-mono text-ink-700 w-6 text-right">{String(i + 1).padStart(2, "0")}</span>
              <div className={`w-11 h-11 rounded-12 bg-gradient-to-br ${COLORS[i % COLORS.length]} flex-shrink-0 flex items-center justify-center text-ink-950 font-display font-bold text-lg`}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/r/${c.slug}`} className="font-semibold text-ink-100 hover:text-gold-300 transition-colors text-sm">{c.name}</Link>
                <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5"><Users size={10} /> {formatCount(c._count?.posts ?? 0)} posts</p>
              </div>
              <button
                onClick={() => toggleJoin(c.id)}
                className={`h-8 px-4 text-xs font-bold rounded-8 border transition-all flex-shrink-0 ${
                  c.joined ? "bg-gold-500/10 text-gold-400 border-gold-500/30" : "border-ink-600 text-ink-400 hover:border-gold-500/40 hover:text-gold-400"
                }`}
              >
                {c.joined ? "✓ Joined" : "Join"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
