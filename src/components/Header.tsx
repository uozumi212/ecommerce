import React from 'react';
import Link from 'next/link';
import { BsBag } from 'react-icons/bs';

const Header = () => {
    return (
        <header className="bg-black text-white p-4">
            <div className="flex justify-between">
                <ul className="flex mt-1">
                    <BsBag className="text-2xl mr-2" />
                    <li><Link href="/">ホーム</Link></li>
                    <li className="ml-2"><Link href="products/new">商品登録</Link></li>
                </ul>
                <ul className="flex mt-1 justify-end">
                    <li><Link href="/auth/signin">ログイン</Link></li>
                    <li className="ml-2"><Link href="/auth/signup">会員登録</Link></li>
                </ul>
            </div>
        </header>
    );
}

export default Header;