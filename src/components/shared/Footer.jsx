import Link from 'next/link';
import { Button, Input } from '@heroui/react';
import { LiaOpencart } from 'react-icons/lia';

const footerLinks = [
    {
        title: 'Shop',
        links: [
            { label: 'All Products', href: '/products' },
            { label: 'Electronics', href: '/products?category=Electronics' },
            { label: 'Footwear', href: '/products?category=Footwear' },
            { label: 'Kitchen', href: '/products?category=Kitchen' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Login', href: '/login' },
            { label: 'Register', href: '/register' },
            { label: 'My Orders', href: '/orders' },
            { label: 'My Profile', href: '/profile' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
        ],
    },
];

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="w-full border-t border-blue-50 bg-white mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-6 xl:col-span-1">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center transition-transform group-hover:scale-105">
                                <span className="text-white font-black text-sm">
                                    <LiaOpencart />
                                </span>
                            </div>
                            <span className="text-2xl font-bold text-blue-900 tracking-wide">eCart</span>
                        </Link>
                        <p className="max-w-md text-sm leading-relaxed text-slate-500">Your modern one-stop shop. Fast checkout, easy returns, and a growing catalog.</p>
                        <div className="max-w-md space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Stay in the loop</h4>
                            <div className="flex flex-col sm:flex-row gap-2 max-w-sm">
                                <Input type="email" placeholder="Enter your email" size="sm" radius="lg" variant="bordered" />
                                <Button size="sm" radius="lg" className="bg-blue-600 font-medium text-white hover:bg-blue-700 px-5">Subscribe</Button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2">
                        {footerLinks.map(section => (
                            <div key={section.title} className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-900">{section.title}</h3>
                                <ul className="space-y-2">{section.links.map(link => <li key={link.label}><Link href={link.href} className="text-sm text-slate-500 transition hover:text-blue-600">{link.label}</Link></li>)}</ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 border-t border-blue-50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">&copy; {year} eCart. All rights reserved.</p>
                    <span className="text-xs text-slate-400">Built with HeroUI v3 &amp; Next.js</span>
                </div>
            </div>
        </footer>
    );
}