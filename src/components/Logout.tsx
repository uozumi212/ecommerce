"use client";
import { useAuth } from "./UseAuth";

export default function Logout() {
  const { signOut, loading } = useAuth();

  return (
    <button onClick={signOut} disabled={loading} className="text-white">
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
