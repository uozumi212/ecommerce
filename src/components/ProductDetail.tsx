"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "./UseAuth";
import { Product, supabase } from "../utils/supabaseClient";
import FavoriteButton from "../components/FavoriteButton";
import { getStripe } from "../utils/stripeClient";
import Layout from "./Layout";

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const { user, signOut, loading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    }
  }, [user]);

  useEffect(() => {
    if (product.quantity > 0) {
      const qtyArray = Array.from(
        { length: product.quantity },
        (_, index) => index + 1
      );
      setQuantities(qtyArray);
    } else {
      setQuantities([]);
    }
  }, [product.quantity]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedQuantity(Number(e.target.value));
  };

  const handleAddToCart = () => {
    console.log(`商品ID: ${product.id} をカートに追加しました。`);
  };

  const handleBuyNow = async () => {
    try {
      const items = [
        {
          name: product.name,
          price: product.price,
          quantity: selectedQuantity,
        },
      ];

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Stripeセッション生成に失敗しました");
      }

      const { sessionId } = await response.json();
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripeの初期化に失敗しました");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error("Stripe Checkoutエラー:", error);
        alert("購入処理に失敗しました。後ほど再度お試しください。");
      } else {
        console.log("Stripe Checkoutにリダイレクトしました");
      }
    } catch (error) {
      console.error("購入処理エラー:", error);
      alert("購入処理に失敗しました。後ほど再度お試しください。");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(price);
  };

  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);

      const response = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (response.error) {
        console.error("商品削除エラー:", response.error);
        throw response.error;
      }

      // 削除成功後、商品一覧ページにリダイレクト
      if (response.status === 204) {
        alert("商品を削除しました");
        router.push("/");
        router.refresh();
      } else {
        alert("商品の削除に失敗しました");
        console.error("商品削除エラー: 予期しないレスポンス");
      }
    } catch (error) {
      console.error("商品削除エラー:", error);
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* パンクズリスト */}
        <nav className="mb-6 text-sm text-gray-600">
          <button
            onClick={() => router.back()}
            className="hover:text-blue-600 transion-colors"
          >
            ← 戻る
          </button>
          <span className="mx-2">/</span>
          <span>商品詳細</span>
        </nav>

        <div className="text-center relative">
          {/* 商品画像 */}
          <div>
            {product.image_url && !imageError ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={500}
                height={400}
                className="mx-auto object-cover"
                onError={() => setImageError(true)}
                priority={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg
                  className="w-24 h-24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            )}
            {/* 商品情報 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4">
                {product.name}
              </h1>
              {product.quantity === 0 ? (
                <p className="text-lg font-semibold mb-2">在庫：✖︎</p>
              ) : (
                <>
                  <p className="text-lg font-semibold mb-2">在庫：⚪︎</p>
                  <select
                    value={selectedQuantity}
                    onChange={handleChange}
                    className="border p-2 rounded"
                  >
                    {quantities.map((qty) => (
                      <option key={qty} value={qty}>
                        {qty}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <p className="text-2xl mt-2 font-bold text-blue mb-4">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* 商品説明 */}
            {product.description && (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  {product.description}
                </h2>
              </div>
            )}
            <div className="flex justify-center">
              <FavoriteButton productId={product.id} />
            </div>
          </div>
        </div>

        {/* 購入ボタン */}
        <div className="text-center justify-center">
          <button
            onClick={handleBuyNow}
            className="w-1/4 mt-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            今すぐ購入
          </button>
          {/* 削除ボタン */}
          {user && user.role === 1 && (
            <button
              onClick={handleDeleteProduct}
              className="w-1/4 ml-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold mt-4 hover:bg-red-700 transition-colors"
            >
              {isDeleting ? "削除中..." : "商品を削除"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
