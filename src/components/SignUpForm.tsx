'use client'
import { useForm } from 'react-hook-form';
import { useAuth } from './UseAuth';
import *  as  yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// バリデーションスキーマ
const schema = yup.object({
    name: yup.string().required('名前は必須です'),
    email: yup.string().email('有効なメールアドレスを入力してください。').required('メールアドレスは必須です'),
    password: yup.string().min(5, 'パスワードは5文字以上必要です。').required('パスワードは必須です'),
    isAdmin: yup.boolean() // 管理者ユーザーかどうかのフラグ
});

type SignUpFormData = {
    name: string;
    email: string;
    password: string;
    isAdmin?: boolean;
};

export default function SignUpForm() {
    const { signUp, loading, error } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            isAdmin: false // デフォルトで一般ユーザー
        }
    });

    const onSubmit = async (data: SignUpFormData) => {
        const role = data.isAdmin ? 1 : 0;
        await signUp(data.email, data.password, data.name, role);
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold text-center mb-4">会員登録</h2>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">名前</label>
                    <input
                        type="text"
                        {...register('name')}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.name && (
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                    <input
                        type="text"
                        {...register('email')}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">パスワード</label>
                    <input
                        type="text"
                        {...register('password')}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-12 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {loading ? '処理中...' : '会員登録'}
                </button>
            </form>
        </div>
    );
}