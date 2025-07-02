import React from 'react';
import { supabase } from '../../../utils/supabaseClient'
import ProductDetail from '../../../components/ProductDetail'
import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        id: string
    }
}

async function getProduct(id: string): Promise<any> {
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
    if (error) {
        console.error('Supabaseエラー:', error)
        throw error
    }

    if (!product) {
        return {
            name: '商品が見つかりませんでした',
        }
    }

    return product
}

export async function generateMetadata({ params }: PageProps): Promise<any> {
    const product = await getProduct(params.id)

    if (!product) {
       notFound()
    }

    return {
        title: `${product.name} - 商品詳細`,
        description: product.description || `${product.name}の詳細ページです`,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image_url ? [product.image_url] : [],
            quantity: product.quantity,
        },
    }
}

export default async function ProductDetailPage({ params }: PageProps) {
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    return <ProductDetail product={product} />
}