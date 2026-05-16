"use client";
import { useState } from "react";
import { PostCard }     from "../components/post/PostCard";
import { PostSkeleton } from "../components/post/PostSkeleton";
import { SortBar }      from "../components/post/SortBar";
import { HomeSidebar }  from "../components/layout/HomeSidebar";
import { usePosts }     from "../context/PostsContext";
import { Navbar }       from "../components/layout/Navbar";

export default function HomePage() {
  const { posts, loading, error } = usePosts();
  const [sort, setSort] = useState("popular");

  const sorted = [...posts].sort((a, b) =>
    sort === "popular"
      ? b.voteScore - a.voteScore
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
      <section>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink-100 mb-1">
            What's happening <span className="text-gold-gradient italic">right now</span>
          </h1>
          <p className="text-sm text-ink-500">Trending posts across all communities</p>
        </div>

        <SortBar sort={sort} onChange={setSort} />

        <div className="space-y-3">
          {loading && Array.from({ length: 4 }).map((_, i) => <PostSkeleton key={i} />)}
          {error   && <p className="text-sm text-rose-400 text-center py-8">{error}</p>}
          {!loading && !error && sorted.map((post, i) => (
            <div key={post.id} className="animate-fade-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${i * 50}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
          {!loading && !error && sorted.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-ink-500 text-sm">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </section>
      <HomeSidebar />
    </div>
    </>
  );
}
