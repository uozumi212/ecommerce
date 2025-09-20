"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { supabase, Product } from "../utils/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";

interface FormData {
  name: string;
  description: string;
  price: number;
  image_url: FileList;
  quantity: number;
}

interface MessageState {
  text: string;
  type: "success" | "error" | null;
}

const ProductRegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({
    text: "",
    type: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMessage({ text: "", type: null });
  }, []);

  const clearMessage = useCallback(() => {
    setMessage({ text: "", type: null });
  }, []);

  // コンポーネントマウント時にメッセージをクリア
  useEffect(() => {
    // メッセージが存在する場合、自動的に消去するタイマーを設定
    if (message.text && message.type) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000); // 5秒後に消去

      // コンポーネントのクリーンアップ時にタイマーを解除
      return () => clearTimeout(timer);
    }
  }, [message.text, message.type, clearMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      // register('image_url', { required: true })
    } else {
      setPreviewImage(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;
    const { error } = await supabase.storage
      .from("product-image")
      .upload(filePath, file);
    if (error) {
      console.error("画像アップロードエラー:", error);
      throw error;
    }

    const { data } = supabase.storage
      .from("product-image")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    setLoading(true);
    clearMessage();

    try {
      let imageUrl: string | null = null;

      if (data.image_url && data.image_url.length > 0) {
        imageUrl = await uploadImage(data.image_url[0]);
        if (!imageUrl) {
          setMessage({ text: "画像アップロードに失敗しました", type: "error" });
          setLoading(false);
          return;
        }
      }

      const productData: Omit<Product, "id" | "created_at" | "updated_at"> = {
        name: data.name,
        price: data.price,
        image_url: imageUrl ?? "",
        description: data.description,
        quantity: data.quantity,
      };

      const { error } = await supabase.from("products").insert([productData]);
      if (error) {
        console.error("データベース登録エラー:", error);
      }
      // 成功したら商品一覧ページに遷移
      router.push("/products/index?message=商品が登録されました&type=success");

      reset();
      setPreviewImage(null);
    } catch (error) {
      console.error("データベース登録エラー:", error);
      setMessage({ text: "商品の登録に失敗しました", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">商品登録</h2>

      {message.text && message.type && (
        <div
          className={`mb-4 mt-4 flex items-center justify-between text-white border-4 ${
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            商品名
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            価格
          </label>
          <input
            type="number"
            {...register("price", { required: true })}
            className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.price && (
            <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            画像
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image_url")}
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.image_url && (
            <p className="mt-2 text-sm text-red-600">
              {errors.image_url.message}
            </p>
          )}
          {/* 画像プレビュー */}
          {previewImage && (
            <div className="mt-4 relative">
              <p className="text-sm text-gray-600 mb-2">プレビュー：</p>
              <Image
                src={previewImage as string}
                alt="プレビュー"
                className="object-cover"
                fill
                priority={true}
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            数量
          </label>
          <select
            {...register("quantity", { required: true, valueAsNumber: true })}
            className="mt-1 pl-1 block w-4/12 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">選択してください</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          {errors.quantity && (
            <p className="mt-2 text-sm text-red-600">
              {errors.quantity.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            商品説明
          </label>
          <textarea
            {...register("description", { required: true })}
            className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-12 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "登録中..." : "商品を登録"}
        </button>
      </form>
    </div>
  );
};

export default ProductRegistrationForm;
