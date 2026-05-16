"use client";
import { createContext, useContext, useReducer } from "react";
import api from "../lib/api";

const CommentsContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "SET":
      // Replace all comments for this postId — prevents duplicates on revisit
      return [
        ...state.filter((c) => c.postId !== action.postId),
        ...action.comments,
      ];
    case "ADD":
      // Only add if not already present (guard against double renders)
      if (state.some((c) => c.id === action.comment.id)) return state;
      return [action.comment, ...state];
    default:
      return state;
  }
}

export function CommentsProvider({ children }) {
  const [comments, dispatch] = useReducer(reducer, []);

  const fetchComments = async (postId) => {
    try {
      const res = await api.get(`/comments/${postId}`);
      dispatch({ type: "SET", postId, comments: res.data.comments });
    } catch (err) {
      console.error("Failed to fetch comments.", err);
    }
  };

  const addComment = async ({ content, postId }) => {
    try {
      const res = await api.post("/comments", { content, postId });
      dispatch({ type: "ADD", comment: res.data.comment });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to post comment." };
    }
  };

  const getPostComments = (postId) => comments.filter((c) => c.postId === postId);

  return (
    <CommentsContext.Provider value={{ fetchComments, addComment, getPostComments }}>
      {children}
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used inside CommentsProvider");
  return ctx;
}
