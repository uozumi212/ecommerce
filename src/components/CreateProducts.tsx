'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase, Product } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation'

interface FormData {
    name: string
    description: string
    price: number
    image_url: FileList
}

const ProductRegistrationForm: React.FC = () => {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>()

    const uploadImage = async (file: File): Promise<string | null> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `products/${fileName}`
        const { error } = await supabase.storage
            .from('product-image')
            .upload(filePath, file)
        if (error) {
            console.error('画像アップロードエラー:', error)
            throw error
        }

        const { data } = supabase.storage
            .from('product-image')
            .getPublicUrl(filePath)
        return data.publicUrl
    }

    const onSubmit = async (data: FormData): Promise<void> => {
        setLoading(true)
        setMessage('')

        try {

            let imageUrl: string | null = null

            if (data.image_url && data.image_url.length > 0) {
                imageUrl = await uploadImage(data.image_url[0])
                if (!imageUrl) {
                    setMessage('画像アップロードに失敗しました')
                    setLoading(false)
                    return
                }
            }

            const productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
                name: data.name,
                price: data.price,
                image_url: imageUrl,
                description: data.description
            }

            const { error } = await supabase.from('products').insert([productData])
            if (error) {
                console.error('データベース登録エラー:', error)
            }

            router.push('/?message=商品が登録されました&type=success');

            setMessage('商品が登録されました!')
            reset()
        } catch (error) {
            console.error('データベース登録エラー:', error)
            setMessage('商品の登録に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-center">商品登録</h2>

            {message && (
                <div className={`mb-4 mt-4 text-center text-white border-4 ${message === '商品が登録されました!' 
                    ? 'bg-green-400' 
                    : 'bg-red-400'
                }`}>
                    {message}
               </div>
                )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">商品名</label>
                    <input
                        type="text"
                        {...register('name', { required: true })}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.name &&
                        <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">価格</label>
                    <input
                        type="number"
                        {...register('price', { required: true })}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.price &&
                        <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">画像</label>
                    <input
                        type="file"
                        {...register('image_url')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.image_url &&
                        <p className="mt-2 text-sm text-red-600">{errors.image_url.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">商品説明</label>
                    <textarea
                        {...register('description', { required: true })}
                        className="pl-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {errors.description &&
                        <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-12 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                {loading ? '登録中...' : '商品を登録'}
                </button>
            </form>
        </div>
    )
}

export default ProductRegistrationForm