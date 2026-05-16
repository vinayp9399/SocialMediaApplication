"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Zap, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 h-14 bg-ink-900/95 backdrop-blur border-b border-ink-700 flex items-center gap-3 px-4 lg:px-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-8 bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center">
          <Zap size={16} className="text-ink-950 fill-ink-950" />
        </div>
        <span className="font-display font-semibold text-lg text-ink-50 hidden sm:block">nexus</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-xl relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search communities, posts..."
          className="w-full h-9 bg-ink-800 border border-ink-700 rounded-8 pl-8 pr-4 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-gold-500/50 transition-colors"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {user ? (
          <>
            <Link
              href="/submit"
              className="hidden sm:flex items-center gap-1.5 h-8 px-3 bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-bold rounded-8 transition-colors"
            >
              <Plus size={14} strokeWidth={2.5} /> New Post
            </Link>

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 h-8 px-2 rounded-8 bg-ink-800 border border-ink-700 hover:border-ink-500 transition-colors"
              >
                <div className="w-5 h-5 rounded-4 bg-gold-500 flex items-center justify-center text-ink-950 font-bold text-xs">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-xs font-semibold text-ink-200">{user.username}</span>
                <ChevronDown size={12} className="text-ink-500 hidden md:block" />
              </button>

              {open && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-ink-800 border border-ink-700 rounded-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-ink-700">
                    <p className="text-xs text-ink-500">Signed in as</p>
                    <p className="text-sm font-semibold text-ink-100">{user.username}</p>
                  </div>
                  <div className="p-1">
                    <Link
  href={`/profile/${user.username}`}
  onClick={() => setOpen(false)}
  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-300 hover:bg-ink-700 rounded-8 transition-colors"
>
  <User size={13} /> Profile
</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-8 transition-colors"
                    >
                      <LogOut size={13} /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login"  className="h-8 px-4 text-xs font-bold text-ink-300 border border-ink-600 rounded-8 hover:border-ink-400 hover:text-ink-100 transition-colors flex items-center">Sign in</Link>
            <Link href="/signup" className="h-8 px-4 text-xs font-bold text-ink-950 bg-gold-500 hover:bg-gold-400 rounded-8 transition-colors flex items-center">Join Nexus</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
