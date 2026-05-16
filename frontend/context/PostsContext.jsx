"use client";
import { createContext, useContext, useReducer, useEffect, useState } from "react";
import api from "../lib/api";

function reducer(state, action) {
  switch (action.type) {
    case "SET":   return action.posts;
    case "ADD":   return [action.post, ...state];
    case "VOTE":
      return state.map((p) => {
        if (p.id !== action.postId) return p;
        const prev = p.userVote;
        const isUndo = prev === action.vote;
        const delta = isUndo ? (action.vote === "up" ? -1 : 1)
          : prev === null ? (action.vote === "up" ? 1 : -1)
          : (action.vote === "up" ? 2 : -2);
        return { ...p, voteScore: p.voteScore + delta, userVote: isUndo ? null : action.vote };
      });
    default: return state;
  }
}

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get("/posts")
      .then((res) => dispatch({ type: "SET", posts: res.data.posts.map(toPost) }))
      .catch(() => setError("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  const addPost = async (data) => {
    try {
      const res = await api.post("/posts", data);
      dispatch({ type: "ADD", post: toPost(res.data.post) });
      return { success: true, post: res.data.post };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create post." };
    }
  };

  const vote = (postId, voteType) => {
    dispatch({ type: "VOTE", postId, vote: voteType }); // optimistic
    api.post("/votes", { postId, type: voteType }).catch(() => {
      dispatch({ type: "VOTE", postId, vote: voteType }); // revert
    });
  };

  return (
    <PostsContext.Provider value={{ posts, loading, error, addPost, vote }}>
      {children}
    </PostsContext.Provider>
  );
}

// Map API post to UI shape — voteScore starts at 0, not total DB count
function toPost(p) {
  return { ...p, voteScore: 0, commentCount: p._count?.comments ?? 0, userVote: null };
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used inside PostsProvider");
  return ctx;
}
