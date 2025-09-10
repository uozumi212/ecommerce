"use client";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">決済がキャンセルされました</h1>
      <p className="mb-4">お支払いは完了しませんでした。</p>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => router.push("/")}
      >
        商品一覧に戻る
      </button>
    </div>
  );
}
