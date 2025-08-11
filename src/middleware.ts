import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { supabase, User } from './utils/supabaseClient';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient(
        { req, res},
        {
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
        }
    );

    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        // 未認証ユーザーをログインページにリダイレクト
        // if (!session && req.nextUrl.pathname.startsWith('/auth')) {
        //     return NextResponse.redirect(new URL('/auth/login', req.url));
        // }
        if (req.nextUrl.pathname === '/auth/login') {
            if (session) {
                // ログイン済みの場合は商品一覧ページへ
                return NextResponse.redirect(new URL('/products', req.url));
            }

            // 未ログインの場合はログインぺージヘ
            return res;
        }

        // // 認証済みユーザーを一覧ページにリダイレクト
        // if (session && (req.nextUrl.pathname.startsWith('/products') || req.nextUrl.pathname.startsWith('/auth/signup'))) {
        //     return NextResponse.redirect(new URL('/products', req.url));
        // }

        // 保護されたルートへのアクセス時の処理
        if (req.nextUrl.pathname === '/products/new') {
            // if (!session) {
            //     console.log('session:', session);
            //     // 未ログインの場合はログインページへ
            //     return NextResponse.redirect(new URL('/', req.url));
            // }

            // // ユーザーのロール情報を取得
            // const { data: user, error } = await supabase
            //     .from('users')
            //     .select('role')
            //     .eq('id', session.user.id)
            //     .single();
            
            //     console.log("user:", user, "error:", error);

            // if (user?.role !== 1) {
            //     return NextResponse.redirect(new URL('/', req.url));
            // }
        }

        return res;
    } catch (error) {
        console.error('エラーが発生しました:', error); // エラーをコンソールに出力
        return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
    }

}

export const config = {
    matcher: [
        '/auth/:path*',
        '/products/:path*',
        '/products/new',
    ],
}