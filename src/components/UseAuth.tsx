'use client'
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
            throw new Error('有効なメールアドレスを入力してください。');
        }


      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
            data: {
                name: name,
                role: role,
            },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error("Supabaseエラー:", error);
        setError(error.message);
        return;
      }

      // if (authData.user) {
      //   // usersテーブルにユーザー情報を保存
      //   const { error: profileError } = await supabase.from("users").insert([
      //     {
      //       id: authData.user.id,
      //       name: name,
      //       role: role,
      //       email: email,
      //       password: password,
      //       created_at: new Date().toISOString(),
      //       updated_at: new Date().toISOString(),
      //     },
      //   ]);
      //   if (profileError) throw profileError;
      // }
      if (data?.user) {

        // router.push("/auth/verify");
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

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/");
    } catch (error: any) {
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
      router.push("/auth/signin");
      alert('ログアウトしました');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session?.user) {
          const { data: user, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
          if (userError) throw userError;
          setUser({ ...session.user, ...user });
        }
      } catch (error: any) {
        console.error("サインインエラー:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const { data: user, error: userError } = supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
        if (userError) throw userError;
        setUser({ ...session.user, ...user });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase])

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
    user,
  };
};
