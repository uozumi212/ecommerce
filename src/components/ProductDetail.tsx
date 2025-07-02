'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Product, supabase } from '../utils/supabaseClient'
import Header from './Header'
import Footer from './Footer'
import { set } from 'react-hook-form'

interface ProductDetailProps {
    product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const router = useRouter()
    const [imageError, setImageError] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)

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
    
    const handleDeleteProduct = async () => {
        try {
            setIsDeleting(true)
            
            const response = await supabase
                .from('products')
                .delete()
                .eq('id', product.id)
            
            if (response.error) {
                console.error('商品削除エラー:', response.error)
                throw response.error
            }

            // 削除成功後、商品一覧ページにリダイレクト
            if (response.status === 204) {
                alert('商品を削除しました')
                router.push('/')
                router.refresh()
            } else {
                alert('商品の削除に失敗しました')
                console.error('商品削除エラー: 予期しないレスポンス')
            }
        } catch (error) {
            console.error('商品削除エラー:', error)
        } finally {
            setIsDeleting(false)
            setDeleteConfirm(false)
        }
    }

    return (
        <>
            <Header />
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
                                width={500}
                                height={400}
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
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-4">
                                {product.name}
                            </h1>
                            {product.quantity === 0 ? (
                                <p className="text-lg font-semibold mb-2">在庫：✖︎</p>
                            ) : (
                                <p className="text-lg font-semibold mb-2">在庫：⚪︎</p>
                            )}
                            <p className="text-2xl font-bold text-blue mb-4">
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
                    {/* 削除ボタン */}
                    <button
                        onClick={handleDeleteProduct}
                        disabled={isDeleting}
                        className="w-1/4 ml-2 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold mt-4 hover:bg-red-700 transition-colors"
                    >
                        {isDeleting ? '削除中...' : '商品を削除'}
                    </button>
                </div>
            </div>
            <Footer />
            </>
    )
}