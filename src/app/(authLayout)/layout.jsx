import Link from 'next/link';
import React from 'react';
import { LiaOpencart } from 'react-icons/lia';

const AuthLayout = ({ children }) => {
    return (
        <div className='min-h-screen flex flex-col bg-linear-to-br from-blue-50 via-white to-indigo-50'>
            <header className='flex items-center justify-between px-6 py-4'>
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm"><LiaOpencart /></span>
                    </div>
                    <span className="text-xl font-bold text-blue-900 tracking-wide">eCart</span>
                </Link>
                <Link href={'/'} className="text-sm text-slate-500 hover:text-blue-600 transition">
                    Back to store
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;