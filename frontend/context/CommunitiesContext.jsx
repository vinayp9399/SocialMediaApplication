"use client";
import { createContext, useContext, useReducer, useEffect, useState } from "react";
import api from "../lib/api";

function reducer(state, action) {
  switch (action.type) {
    case "SET":  return action.communities;
    case "ADD":  return [action.community, ...state];
    case "JOIN": return state.map((c) =>
      c.id !== action.id ? c : { ...c, joined: !c.joined }
    );
    default: return state;
  }
}

const CommunitiesContext = createContext(null);

export function CommunitiesProvider({ children }) {
  const [communities, dispatch] = useReducer(reducer, []);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    api.get("/communities")
      .then((res) => dispatch({ type: "SET", communities: res.data.communities.map((c) => ({ ...c, joined: false })) }))
      .catch(() => setError("Failed to load communities."))
      .finally(() => setLoading(false));
  }, []);

  const addCommunity = async ({ name, slug }) => {
    try {
      const res = await api.post("/communities", { name, slug });
      dispatch({ type: "ADD", community: { ...res.data.community, joined: true } });
      return { success: true, community: res.data.community };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to create community." };
    }
  };

  const toggleJoin = (id) => dispatch({ type: "JOIN", id });
  const getCommunityBySlug = (slug) => communities.find((c) => c.slug === slug) ?? null;

  return (
    <CommunitiesContext.Provider value={{ communities, loading, error, addCommunity, toggleJoin, getCommunityBySlug }}>
      {children}
    </CommunitiesContext.Provider>
  );
}

export function useCommunities() {
  const ctx = useContext(CommunitiesContext);
  if (!ctx) throw new Error("useCommunities must be used inside CommunitiesProvider");
  return ctx;
}
