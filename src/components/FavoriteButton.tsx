"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "./UseAuth";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface FavoriteButtonProps {
  productId: string;
}

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // いいね状態をチェック
  const checkFavoriteStatus = useCallback(async () => {
    try {
      if (!user?.id) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("product_likes")
        .select("*")
        .eq("user_id", user?.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (error) {
        console.log("いいねエラー:", error);
        throw error;
      }

      setIsFavorite(!!data);
    } catch (error) {
      console.log("いいねエラー:", error);
    } finally {
      setLoading(false);
    }
  }, [user, productId]);

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    } else {
      setLoading(false);
    }
  }, [user, productId, checkFavoriteStatus]); // checkFavoriteStatus が依存配列に含まれていない;

  // いいねを切り替え
  const toggleFavorite = async () => {
    if (!user) {
      // ユーザーがログインしていない場合はログインページへ
      alert("いいねするにはログインしてください。");
      return;
    }

    try {
      setLoading(true);
      setIsAnimating(true);

      if (isFavorite && user?.id) {
        // いいねを削除
        const { error } = await supabase
          .from("product_likes")
          .delete()
          .eq("user_id", user?.id)
          .eq("product_id", productId);

        if (error) throw error;
      } else {
        // いいねを追加
        const { error } = await supabase.from("product_likes").insert({
          user_id: user.id,
          product_id: productId,
        });

        if (error) throw error;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log("いいねエラー:", error);
    } finally {
      setLoading(false);
      // アニメーション終了のタイミングを遅らせる
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="mt-4 flex items-center text-white"
      aria-label={isFavorite ? "いいねを解除する" : "いいねする"}
    >
      {isFavorite ? (
        <AiFillHeart
          className={`text-red-500 text-2xl transform transition-all duration-300
					${isAnimating ? "scale-125 animate-bounce" : "scale-100"}`}
        />
      ) : (
        <AiOutlineHeart
          className={`text-gray-500 text-2xl transition-all duration-300
					${isAnimating ? "scale-125 animate-bounce" : "scale-100"}`}
        />
      )}
    </button>
  );
}
