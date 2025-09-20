import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  console.log("Auth callback triggered:", code ? "コードあり" : "コードなし");

  if (code) {
    try {
      const cookieStore = cookies();
      console.log(
        "Cookieストア:",
        cookieStore.getAll().map((c) => c.name)
      );

      const supabase = createRouteHandlerClient({ cookies });
      const result = await supabase.auth.exchangeCodeForSession(code);

      console.log("セッション交換結果:", result.error ? "エラー" : "成功");

      // セッションを直接取得して確認
      const { data } = await supabase.auth.getSession();
      console.log("コールバック内セッション:", data.session ? "あり" : "なし");

      if (result.error) {
        console.error("コード交換エラー:", result.error);
        return NextResponse.redirect(
          new URL("/auth/signin?error=auth_error", requestUrl.origin)
        );
      }
    } catch (error) {
      console.error("コールバック処理エラー:", error);
      return NextResponse.redirect(
        new URL("/auth/signin?error=callback_error", requestUrl.origin)
      );
    }
  }

  console.log("ホームページへリダイレクト");
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
