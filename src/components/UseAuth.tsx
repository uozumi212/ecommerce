"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import { useEffect } from "react";

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // サインアップ
  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: number = 0
  ) => {
    try {
      setLoading(true);
      setError(null);

      // メールアドレスの形式を確認
      if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        throw new Error("有効なメールアドレスを入力してください。");
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name,
            role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Supabaseエラー:", error);
        setError(error.message);
        return;
      }

      if (data.user) {
        // usersテーブルにユーザー情報を保存
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            name: name,
            role: role,
            email: email,
            password: password,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        if (profileError) throw profileError;
      }
      if (data?.user) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("サインアップエラー:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ログイン
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // ログイン実行
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // セッションCookieを設定するためには、リダイレクトよりも
      // セッションレスポンスを返すことが重要
      if (data.session?.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        if (userError) throw userError;
        setUser({ ...data.session.user, ...userData });
      }

      // セッションが確実に保存されるように完全リロード
      window.location.href = "/";
      return data;
    } catch (error: any) {
      console.error("ログインエラー:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      await supabase.auth.signOut();
      window.location.href = "/auth/signin";

      router.refresh();
      router.push("/auth/signin");
      alert("ログアウトしました");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (userError) throw userError;
          setUser({ ...session.user, ...userData });
        }
      } catch (error: any) {
        console.error("サインインエラー:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {

      if (session?.user) {
        try {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (userError) throw userError;
          setUser({ ...session.user, ...userData });
        } catch (error) {
          console.error("ユーザーデータ取得エラー:", error);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
    user,
  };
};
