import { useRouter } from 'next/navigation'
import { supabase } from '../utils/supabaseClient'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useAuth = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // サインアップ
    const signUp = async (email: string, password: string, name: string, role: number = 0) => {
        try {
            setLoading(true);
            setError(null);

            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;

            if (authData.user) {
                // usersテーブルにユーザー情報を保存
                const { error: profileError } = await supabase
                    .from('users')
                    .insert([
                        {
                            id: authData.user.id,
                            name: name,
                            role: role,
                            email: email,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        },
                    ]);
                if (profileError) throw profileError;

                router.push('/auth/verify');
            }
        } catch (error: any) {
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

            const { data, error} = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/');
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
            router.push('/auth/login');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        signUp,
        signIn,
        signOut,
        loading,
        error,
    };
};