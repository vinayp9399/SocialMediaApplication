"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Share2, Bookmark } from "lucide-react";
import { VoteButtons }      from "../../../components/vote/VoteButtons";
import { CommentItem }      from "../../../components/comment/CommentItem";
import { CommentBox }       from "../../../components/comment/CommentBox";
import { CommunitySidebar } from "../../../components/community/CommunitySidebar";
import { useComments }      from "../../../context/CommentsContext";
import { usePosts }         from "../../../context/PostsContext";
import { PostSkeleton }     from "../../../components/post/PostSkeleton";
import { timeAgo }          from "../../../lib/utils";
import api                  from "../../../lib/api";
import { Navbar }       from "../../../components/layout/Navbar";



export default function PostPage({ params }) {
  const { id } = params;
  const { vote } = usePosts();
  const { fetchComments, addComment, getPostComments } = useComments();
  const [post, setPost]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/posts/${id}`),
      fetchComments(id),
    ])
      .then(([res]) => setPost({ ...res.data.post, voteScore: 0, userVote: null }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const comments = getPostComments(id);

  const handleComment = async (content) => {
    await addComment({ content, postId: id });
    if (post) setPost((p) => ({ ...p, commentCount: (p.commentCount ?? 0) + 1 }));
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
      <PostSkeleton />
    </div>

  );

  if (!post) return (
    <div className="text-center py-20 text-ink-500 text-sm">Post not found.</div>
  );



  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 mb-4 transition-colors">
          <ArrowLeft size={13} /> Back to feed
        </Link>

        <article className="card mb-4 overflow-hidden">
          <div className="flex">
            <VoteButtons postId={post.id} score={post.voteScore} userVote={post.userVote} />
            <div className="flex-1 p-5">
              <div className="flex items-center gap-2 mb-3 text-xs text-ink-500 flex-wrap">
                <Link href={`/r/${post.community.slug}`} className="font-semibold text-ink-300 hover:text-gold-400 transition-colors">
                  {post.community.name}
                </Link>
                <span>·</span>
                <span>{post.author.username}</span>
                <span>·</span>
                <span className="font-mono">{timeAgo(post.createdAt)}</span>
              </div>



              <h1 className="font-display text-xl font-semibold text-ink-100 leading-snug mb-4">{post.title}</h1>
              {post.imageUrl && (
                <div className="mb-4 rounded-8 overflow-hidden border border-ink-700">
                  <img src={post.imageUrl} alt={post.title} className="w-full object-cover max-h-[480px]" />
                </div>
              )}



              {post.content && <p className="text-sm text-ink-300 leading-relaxed mb-4">{post.content}</p>}

              <div className="flex items-center gap-1 pt-4 border-t border-ink-800">
                <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-ink-500">
                  <MessageSquare size={13} /> {comments.length} comments
                </span>

                {[{ Icon: Share2, label: "Share" }, { Icon: Bookmark, label: "Save" }].map(({ Icon, label }) => (
                  <button key={label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-8 text-xs text-ink-500 hover:bg-ink-800 hover:text-ink-200 transition-colors">
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>



        <div className="card p-5">
          <CommentBox onSubmit={handleComment} />
          {comments.length === 0
            ? <p className="text-ink-600 text-sm text-center py-8">No comments yet. Start the conversation.</p>
            : comments.map((c) => <CommentItem key={c.id} comment={c} />)
          }
        </div>
      </div>

      <CommunitySidebar slug={post.community.slug} />
    </div>
    </>
  );
} 

