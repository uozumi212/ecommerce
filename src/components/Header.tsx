import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="bg-black text-white p-4">
            <div className="flex">
                <h1 className="text-bold text-2xl">Header</h1>
                <ul className="flex mt-1 ml-8">
                    <li><Link href="/">ホーム</Link></li>
                    <li className="ml-2"><Link href="products/new">商品登録</Link></li>
                </ul>
            </div>
        </header>
    );
}

export default Header;