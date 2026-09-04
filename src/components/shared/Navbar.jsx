import Link from 'next/link';
import { Button } from '@heroui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { LiaOpencart } from "react-icons/lia";

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
];

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 border-b border-blue-50 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm"><LiaOpencart /></span>
                    </div>
                    <span className="text-xl font-bold text-blue-900 tracking-wide">eCart</span>
                </Link>

                <ul className="hidden md:flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-2">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-3">
                    <Link href="/cart">
                        <Button isIconOnly variant="light" size="sm"><FiShoppingCart size={20} /></Button>
                    </Link>
                    <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
                        Login
                    </Link>
                    <Link href="/auth/register">
                        <Button className="h-10 bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-200 rounded-xl">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;