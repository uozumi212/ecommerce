'use client'
import React from 'react';
import Link from 'next/link';
import {BsBag} from 'react-icons/bs';
import {useAuth} from './UseAuth';
import {useEffect, useState} from 'react';
import {supabase} from "../utils/supabaseClient";

const Header = () => {
    const {user, signOut, loading} = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAuthenticated(true);
        }
    }, [user]);

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         const { data: { session } } = await supabase.auth.getSession();
    //         setIsAuthenticated(!!session);
    //     };
    //
    //     checkAuth();
    //
    //     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    //         setIsAuthenticated(!!session);
    //     }) ;
    //
    //     return () => {
    //         subscription.unsubscribe();
    //     };
    // }, [supabase]);

    return (
        <header className="bg-black text-white p-4">
            <div className="flex justify-between">
                <ul className="flex mt-1">
                    <BsBag className="text-2xl mr-2"/>
                    <li><Link href="/">ホーム</Link></li>
                    {user && user.role === 1 ? (
                        <li className="ml-2">
                            <Link href="/products/new">商品登録</Link>
                        </li>
                    ) : (
                    ""
                    )}
                </ul>
                <ul className="flex mt-1 justify-end">
                    {user && (
                        <li className="mr-2">ようこそ、{user.user_metadata?.name || 'ゲスト'}さん</li>
                    )}
                    {isAuthenticated ? (
                        <li>
                            <button
                                onClick={signOut}
                                disabled={loading}
                                className="text-white hover:text-gray-300 transition duration-150"
                            >
                                {loading ? 'ログアウト中...' : 'ログアウト'}
                            </button>
                        </li>
                    ) : (
                        <>
                            <li className="hover:text-gray-300 transition duration-150"><Link
                                href="/auth/signin">ログイン</Link></li>
                            <li className="ml-2 hover:text-gray-300 transition duration-150"><Link
                                href="/auth/signup">会員登録</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;