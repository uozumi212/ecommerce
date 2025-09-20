"use client";
import { useForm } from "react-hook-form";
import { useAuth } from "@/components/UseAuth";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Layout from "@/components/Layout"; // Layoutコンポーネントをインポート
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const schema = yup.object({
  email: yup
    .string()
    .email("有効なメールアドレスを入力してください。")
    .required("メールアドレスは必須です"),
  password: yup
    .string()
    .min(5, "パスワードは5文字以上必要です。")
    .required("パスワードは必須です"),
});

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  // SignInFormからSignInPageに変更
  const { signIn, loading, error, user } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(schema),
  });

  // セッションがある場合はリダイレクト
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data.email, data.password);
      // 成功したらクライアント側のステートを更新するために強制リフレッシュ
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold text-center mb-4">ログイン</h2>
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              {...register("email")}
              className="pl-2 mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              {...register("password")}
              className="pl-2 mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-1/3 flex mx-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "処理中..." : "ログイン"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
