"use client";
import { AuthProvider }        from "./AuthContext";
import { CommunitiesProvider } from "./CommunitiesContext";
import { PostsProvider }       from "./PostsContext";
import { CommentsProvider }    from "./CommentsContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CommunitiesProvider>
        <PostsProvider>
          <CommentsProvider>
            {children}
          </CommentsProvider>
        </PostsProvider>
      </CommunitiesProvider>
    </AuthProvider>
  );
}
