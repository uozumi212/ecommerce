'use client'
import React from 'react';
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductList from '@/app/products/index/page'
import {useSearchParams} from 'next/navigation'
import {useState, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {supabase, Product} from '../utils/supabaseClient'

interface FormData {
    name: string
    description: string
    price: number
    image_url: FileList
}


export default function Home() {
    const searchParams = useSearchParams()
    const [notification, setNotification] = useState<{
        message: string
        type: 'success' | 'error'
    } | null>(null)

    useEffect(() => {
        const message = searchParams.get('message')
        const type = searchParams.get('type') as 'success' | 'error'
        if (message) {
            setNotification({
                message,
                type
            })

            setTimeout(() => {
                setNotification(null)
            }, 10000)
        }
    }, [searchParams])

    return (
        <div>
            <Header/>
            {/* 通知メッセージ*/}
            {notification && (
                <div className={`mb-4 mt-4 p-4 rounded-lg mx-auto w-2/12 text-white font-semibold 
                ${notification.type === 'success'
                    ? 'bg-green-300'
                    : 'bg-red-400'
                }
                `}>
                    {notification.message}
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-2 text-white hover:text-gray-300"
                    >
                        ✖
                    </button>
                </div>
            )}
            <main className="flex min-h-screen flex-col items-center justify-between mt-8">
                <ProductList/>
            </main>
            <Footer/>
        </div>
    );
}
