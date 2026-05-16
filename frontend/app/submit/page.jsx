"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileText, ImageIcon, Link2, X, ArrowLeft, Loader2 } from "lucide-react";
import { usePosts }       from "../../context/PostsContext";
import { useCommunities } from "../../context/CommunitiesContext";
import { useAuth }        from "../../context/AuthContext";
import { Navbar } from "../../components/layout/Navbar";

export default function SubmitPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { user }     = useAuth();
  const { addPost }  = usePosts();
  const { communities } = useCommunities();

  const [postType, setPostType] = useState("text");
  const [community, setCommunity] = useState(searchParams.get("community") || "");
  const [title, setTitle]         = useState("");
  const [content, setContent]     = useState("");
  const [url, setUrl]             = useState("");
  const [image, setImage]         = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const canSubmit = community && title.trim() && (
    postType === "text" ? content.trim() : postType === "link" ? url.trim() : !!image
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || !user) return;

    const selected = communities.find((c) => c.slug === community);
    if (!selected) return;

    setSubmitting(true);
    setError("");

    const result = await addPost({
      title:       title.trim(),
      content:     postType === "text" ? content.trim() : url.trim(),
      communityId: selected.id,
      imageUrl:    postType === "image" ? image : null,
    });

    setSubmitting(false);
    if (result.success) router.push(`/r/${community}`);
    else setError(result.message);
  };

  const tabs = [
    { type: "text",  label: "Text",  Icon: FileText  },
    { type: "image", label: "Image", Icon: ImageIcon },
    { type: "link",  label: "Link",  Icon: Link2     },
  ];

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 mb-6 transition-colors">
        <ArrowLeft size={13} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-100 mb-6">
        Create a <span className="text-gold-gradient italic">Post</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-8 text-xs text-rose-400">{error}</div>
        )}

        <div>
          <label className="block text-xs font-bold text-ink-400 uppercase tracking-widest mb-2">Community</label>
          <select
            value={community}
            onChange={(e) => setCommunity(e.target.value)}
            className="w-full h-10 bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-3 text-sm text-ink-100 focus:outline-none transition-colors appearance-none"
          >
            <option value="">Select a community...</option>
            {communities.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div className="card overflow-hidden">
          <div className="flex border-b border-ink-800">
            {tabs.map(({ type, label, Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold transition-all border-b-2 ${
                  postType === type ? "border-gold-500 text-gold-400" : "border-transparent text-ink-500 hover:text-ink-300"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 300))}
                placeholder="Title"
                className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-4 py-3 pr-16 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-700 font-mono">{title.length}/300</span>
            </div>

            {postType === "text" && (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                rows={6}
                className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none resize-none transition-colors"
              />
            )}

            {postType === "link" && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none transition-colors"
              />
            )}

            {postType === "image" && (
              !image ? (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-ink-700 hover:border-gold-500/40 rounded-8 cursor-pointer bg-ink-800/50 transition-colors">
                  <ImageIcon size={28} className="text-ink-600 mb-2" />
                  <span className="text-sm text-ink-500">Upload an image</span>
                  <span className="text-xs text-ink-700 mt-1">PNG, JPG, GIF up to 20MB</span>
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
              ) : (
                <div className="relative rounded-8 overflow-hidden border border-ink-700">
                  <img src={image} alt="Preview" className="w-full object-cover max-h-64" />
                  <button type="button" onClick={() => setImage(null)} className="absolute top-2 right-2 w-7 h-7 bg-ink-950/80 rounded-4 flex items-center justify-center text-ink-300 hover:text-ink-100">
                    <X size={14} />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()} disabled={submitting} className="h-9 px-4 border border-ink-700 rounded-8 text-xs font-bold text-ink-400 hover:text-ink-200 hover:border-ink-500 transition-colors disabled:opacity-30">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="h-9 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed text-ink-950 text-xs font-bold rounded-8 transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
