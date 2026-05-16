"use client";
import { useState, useEffect } from "react";
import { PostCard }          from "../../../components/post/PostCard";
import { PostSkeleton }      from "../../../components/post/PostSkeleton";
import { SortBar }           from "../../../components/post/SortBar";
import { CommunitySidebar }  from "../../../components/community/CommunitySidebar";
import { useCommunities }    from "../../../context/CommunitiesContext";
import { COLORS }            from "../../../lib/utils";
import api                   from "../../../lib/api";
import { Navbar }       from "../../../components/layout/Navbar";

export default function CommunityPage({ params }) {
  const { slug } = params;
  const { communities, getCommunityBySlug, toggleJoin } = useCommunities();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort]     = useState("popular");

  const community = getCommunityBySlug(slug);
  const idx   = communities.findIndex((c) => c.slug === slug);
  const color = COLORS[idx % COLORS.length] ?? COLORS[0];

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/community/${slug}?sort=${sort}`)
      .then((res) => setPosts(res.data.posts.map((p) => ({
        ...p, voteScore: p._count?.votes ?? 0, commentCount: p._count?.comments ?? 0, userVote: null,
      }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, sort]);

  if (!community) return (
    <div className="text-center py-20 text-ink-500 text-sm">Community not found.</div>
  );

  return (
    <>
    <Navbar />
      <div className={`w-full h-28 bg-gradient-to-r ${color} relative`}>
        <div className="absolute inset-0 bg-ink-950/50" />
      </div>

      <div className="bg-ink-900/80 backdrop-blur border-b border-ink-800">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4 flex items-center gap-4">
          <div className={`w-14 h-14 rounded-12 bg-gradient-to-br ${color} -mt-8 border-2 border-ink-900 flex items-center justify-center text-ink-950 font-display font-bold text-2xl`}>
            {community.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold text-ink-100">{community.name}</h1>
          </div>
          <button
            onClick={() => toggleJoin(community.id)}
            className={`h-9 px-5 text-xs font-bold rounded-8 border transition-all ${
              community.joined ? "bg-gold-500/10 text-gold-400 border-gold-500/30" : "bg-gold-500 text-ink-950 border-gold-500 hover:bg-gold-400"
            }`}
          >
            {community.joined ? "✓ Joined" : "Join"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <section>
          <SortBar sort={sort} onChange={setSort} />
          <div className="space-y-3">
            {loading && Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
            {!loading && posts.length === 0 && (
              <div className="card p-12 text-center">
                <p className="text-ink-500 text-sm">No posts yet. Be the first!</p>
              </div>
            )}
            {!loading && posts.map((post, i) => (
              <div key={post.id} className="animate-fade-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: `${i * 50}ms` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>
        <CommunitySidebar slug={slug} />
      </div>
    </>
  );
}
