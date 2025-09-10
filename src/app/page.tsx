"use client";
import React from "react";
import ProductList from "@/app/products/index/page";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const message = searchParams.get("message");
    const type = searchParams.get("type") as "success" | "error";
    if (message) {
      setNotification({
        message,
        type,
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  }, [searchParams]);

  return (
    <div>
      {/* 通知メッセージ*/}
      {notification && (
        <div
          className={`mb-4 mt-4 p-4 rounded-lg mx-auto w-2/12 text-white font-semibold 
                ${
                  notification.type === "success"
                    ? "bg-green-500"
                    : "bg-red-400"
                }
                `}
        >
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-white hover:text-gray-300"
          >
            ✖
          </button>
        </div>
      )}
      <ProductList />
    </div>
  );
}
