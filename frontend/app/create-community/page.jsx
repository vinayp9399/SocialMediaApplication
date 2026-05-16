"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useCommunities } from "../../context/CommunitiesContext";
import { useAuth }        from "../../context/AuthContext";
import { Navbar }       from "../../components/layout/Navbar";

export default function CreateCommunityPage() {
  const router = useRouter();
  const { addCommunity } = useCommunities();
  const { user }         = useAuth();
  const [name, setName]           = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState("");

  const slug    = name.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 21);
  const isValid = slug.length >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || !user) return;
    setSubmitting(true);
    setError("");
    const result = await addCommunity({ name: slug, slug });
    setSubmitting(false);
    if (result.success) router.push(`/r/${slug}`);
    else setError(result.message);
  };

  return (
    <>
    <Navbar />
    <div className="max-w-xl mx-auto px-4 lg:px-8 py-10">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-200 mb-6 transition-colors">
        <ArrowLeft size={13} /> Back
      </button>

      <h1 className="font-display text-2xl font-semibold text-ink-100 mb-1">
        Start a <span className="text-gold-gradient italic">Community</span>
      </h1>
      <p className="text-sm text-ink-500 mb-8">Build a home for conversations that matter to you.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-8">
            <AlertCircle size={13} className="text-rose-400" />
            <p className="text-xs text-rose-400">{error}</p>
          </div>
        )}

        <div className="card p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink-400 uppercase tracking-widest mb-2">Community Name</label>
            <p className="text-xs text-ink-600 mb-2">Cannot be changed after creation.</p>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm text-ink-500 font-semibold pointer-events-none">c/</span>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                maxLength={21}
                placeholder="community_name"
                className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 pl-8 pr-3 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none transition-colors"
              />
            </div>
            {name && (
              <div className="flex items-center gap-1.5 mt-2">
                {isValid
                  ? <><CheckCircle size={12} className="text-jade-400" /><span className="text-xs text-jade-400">c/{slug} is available</span></>
                  : <><AlertCircle size={12} className="text-rose-400" /><span className="text-xs text-rose-400">Must be at least 3 characters</span></>
                }
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-400 uppercase tracking-widest mb-2">
              Description <span className="text-ink-700 normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this community about?"
              rows={3}
              className="w-full bg-ink-800 border border-ink-700 focus:border-gold-500/40 rounded-8 px-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none resize-none transition-colors"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => router.back()} disabled={submitting} className="h-9 px-4 border border-ink-700 rounded-8 text-xs font-bold text-ink-400 hover:text-ink-200 hover:border-ink-500 transition-colors disabled:opacity-30">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="h-9 px-6 bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:cursor-not-allowed text-ink-950 text-xs font-bold rounded-8 transition-colors flex items-center gap-2"
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {submitting ? "Creating..." : "Create Community"}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
