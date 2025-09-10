"use client";
import React from "react";
import { useState, useEffect } from "react";
import { supabase, Product } from "../../../utils/supabaseClient";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import Layout from "@/components/Layout";
import Image from "next/image";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(
    null
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchProducts();

    // URLパラメータからメッセージを取得
    const msgText = searchParams?.get("message");
    const msgType = searchParams?.get("type");

    if (msgText && msgType) {
      setMessage({ text: msgText, type: msgType });

      // 5秒後にメッセージを消す
      const timer = setTimeout(() => {
        setMessage(null);
        // URLパラメータを削除（履歴に残さないため）
        const url = new URL(window.location.href);
        url.searchParams.delete("message");
        url.searchParams.delete("type");
        window.history.replaceState({}, "", url.toString());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const clearMessage = () => {
    setMessage(null);
    // URLパラメータを削除
    const url = new URL(window.location.href);
    url.searchParams.delete("message");
    url.searchParams.delete("type");
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Supabaseエラー:", error);
        throw error;
      }
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (error) {
      console.error("データベース取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-center text-3xl font-bold mb-8 mt-8">商品一覧</h1>

        {/* メッセージ表示部分 */}
        {message && (
          <div
            className={`mb-4 p-3 flex items-center justify-between text-white ${
              message.type === "success" ? "bg-green-400" : "bg-red-400"
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="ml-2 focus:outline-none"
              aria-label="メッセージを閉じる"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center p-8">
            <h2 className="text-gray-500 text-lg">商品がありません。</h2>
          </div>
        ) : (
          <>
            <input
              className="pl-4 py-2 bg-gray-100 rounded-lg w-full mb-8"
              type="text"
              placeholder="検索"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="grid grid-cols-1 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center p-8">
                  <h2 className="text-gray-500 text-lg">
                    商品が見つかりません。
                  </h2>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-row items-center mt-2 border-b pb-4"
                  >
                    {product.image_url && (
                      <Link
                        href={`/products/${product.id}`}
                        className="flex-shrink-0 mr-6"
                      >
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          className="w-80 h-80 object-cover rounded"
                          width={256}
                          height={256}
                        />
                      </Link>
                    )}
                    <div className="flex-grow text-left ml-12">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-semibold mb-2">
                          商品名：{product.name}
                        </h3>
                      </Link>
                      <Link href={`/products/${product.id}`}>
                        <p className="text-lg font-semibold mb-2">
                          商品説明：{product.description}
                        </p>
                      </Link>
                      {product.quantity === 0 ? (
                        <p className="text-lg font-semibold mb-2">在庫：✖︎</p>
                      ) : (
                        <p className="text-lg font-semibold mb-2">在庫：⚪︎</p>
                      )}
                      <Link href={`/products/${product.id}`}>
                        <p className="text-lg font-semibold ">
                          金額：{product.price}円
                        </p>
                      </Link>
                      <FavoriteButton productId={product.id} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductList;
