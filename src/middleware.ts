import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // コールバックルートはスキップ
  if (req.nextUrl.pathname === "/auth/callback") {
    console.log("コールバックルートをスキップします");
    return NextResponse.next();
  }

  // リクエストからレスポンスを作成
  const res = NextResponse.next();

  // ミドルウェア用のSupabaseクライアント作成
  const supabase = createMiddlewareClient({ req, res });

  // すべてのリクエストCookieをログに出力（開発用）
  // console.log(
  //   "リクエストCookies:",
  //   req.cookies.getAll().map((c) => c.name)
  // );

  try {
    // セッションの取得
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("セッション取得エラー:", error);
    }

    // console.log("ミドルウェア内のセッション:", data.session ? "あり" : "なし");

    // 保護されたルートへのアクセスチェック
    if (req.nextUrl.pathname === "/products/new") {
      if (!data.session) {
        // console.log("セッションなし - ログインページへリダイレクト");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }

      // 以下は変更なし
      // ...
    }

    // 認証パスの処理（コールバックを除く）
    if (
      req.nextUrl.pathname.startsWith("/auth") &&
      req.nextUrl.pathname !== "/auth/callback"
    ) {
      if (data.session) {
        // console.log(
        //   "認証済みユーザーがauth/*にアクセス - ホームへリダイレクト"
        // );
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return res;
  } catch (error) {
    console.error("ミドルウェアエラー:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/auth/:path*", "/products/new"],
};
