"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get("session_id");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("セッションIDが見つかりません。");
      setLoading(false);
      return;
    }
    async function fetchSession() {
      try {
        const res = await fetch(`/api/checkout-session?sessionId=${sessionId}`);
        if (!res.ok) throw new Error("注文情報の取得に失敗しました。");
        const data = await res.json();
        setSession(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {error}</p>;

  return (
    <div className="container mx-auto mt-2 p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">ご購入ありがとうございます！</h1>
      <p>注文番号: {session?.id}</p>
      <p>支払い状態: {session?.payment_status}</p>
      <div>
        <h2 className="font-semibold mt-4">商品詳細</h2>
        <ul>
          {session?.line_items?.data.map((item: any) => (
            <li key={item.id}>
              {item.quantity} x {item.description} - ￥{item.amount_total * 1.1}
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/")}
      >
        トップページへ戻る
      </button>
    </div>
  );
}
