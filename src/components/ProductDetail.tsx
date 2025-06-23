'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product } from '../utils/supabaseClient'

interface ProductDetailProps {
    product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const router = useRouter()
    const [imageError, setImageError] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        console.log(`商品ID: ${product.id} をカートに追加しました。`)
    }

    const handleBuyNow = () => {
        console.log(`商品ID: ${product.id} を購入しました。`)
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(`ja-JP`, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    }

    console.log('product:',product)

    return (
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

            <div className="text-center">
                {/* 商品画像 */}
                <div>
                    {product.image_url && !imageError ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            width={700}
                            height={800}
                            className="mx-auto"
                            onError={() => setImageError(true)}
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                            </svg>
                        </div>
                    )}
                    {/* 商品情報 */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-4">
                            {product.name}
                        </h1>
                        <p className="text-4xl font-bold text-blue mb-4">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    {/* 商品説明 */}
                    {product.description && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">{product.description}</h2>
                        </div>
                    )}
                </div>
            </div>

            {/* 購入ボタン */}
            <div className="text-center">
                <button
                    onClick={handleBuyNow}
                    className="w-1/4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    今すぐ購入
                </button>
                <button
                    onClick={handleAddToCart}
                    className="w-1/4 ml-2 bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold mt-4 hover:bg-gray-200 transition-colors border border-gray-300"
                >
                    カートに追加
                </button>
            </div>
        </div>
    )
}