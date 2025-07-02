'use client'
import React from 'react';
import {useState, useEffect} from 'react'
import {supabase, Product} from '../../../utils/supabaseClient'
import Link from 'next/link'
import {set} from 'react-hook-form';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredProducts(products)
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredProducts(filtered)
        }
    }, [searchTerm, products])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const {data, error} = await supabase
                .from('products')
                .select('*')
                .order('created_at', {ascending: false})
            if (error) {
                console.error('Supabaseエラー:', error)
                throw error
            }
            setProducts(data || [])
            setFilteredProducts(data || [])
        } catch (error) {
            console.error('データベース取得エラー:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">読み込み中...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-center text-3xl font-bold mb-8">商品一覧</h1>

            {products.length === 0 ? (
                <div className="text-center p-8">
                    <h2 className="text-gray-500 text-lg">商品の画像がありません。</h2>
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
                                <h2 className="text-gray-500 text-lg">商品が見つかりません。</h2>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <div key={product.id} className="flex flex-row items-center mt-2 border-b pb-4">
                                    {product.image_url && (
                                        <Link href={`/products/${product.id}`} className="flex-shrink-0 mr-6">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-80 h-80 object-cover rounded"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-grow text-left">
                                        <Link href={`/products/${product.id}`}><h3
                                            className="text-lg font-semibold mb-2">商品名：{product.name}</h3></Link>
                                        <Link href={`/products/${product.id}`}><p
                                            className="text-lg font-semibold mb-2">商品説明：{product.description}</p>
                                        </Link>
                                        {product.quantity === 0 ? (
                                            <p className="text-lg font-semibold mb-2">在庫：✖︎</p>
                                        ) : (
                                            <p className="text-lg font-semibold mb-2">在庫：⚪︎</p>
                                        )}
                                        <Link href={`/products/${product.id}`}><p
                                            className="text-lg font-semibold ">金額：{product.price}円</p></Link>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* {products.map((product) => (
                                <div key={product.id} className="flex flex-row items-center mt-8 border-b pb-4">
                                    {product.image_url && (
                                        <Link href={`/products/${product.id}`} className="flex-shrink-0 mr-6">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-80 h-80 object-cover rounded"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-grow text-left">
                                        <Link href={`/products/${product.id}`}><h3 className="text-lg font-semibold mb-2">商品名：{product.name}</h3></Link>
                                        <Link href={`/products/${product.id}`}><p className="text-lg font-semibold mb-2">商品説明：{product.description}</p></Link>
                                        <Link href={`/products/${product.id}`}> <p className="text-lg font-semibold ">金額：{product.price}円</p></Link>
                                    </div>
                                </div>
                            ))} */}
                    </div>
                </>

            )}
        </div>
    )
}

export default ProductList;