'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMonitor, FiShoppingBag, FiCoffee, FiWatch, FiBook, FiHome } from 'react-icons/fi';

const categories = [
    { label: 'Electronics', icon: <FiMonitor size={28} />, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100', href: '/products?category=Electronics' },
    { label: 'Footwear', icon: <FiShoppingBag size={28} />, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100', href: '/products?category=Footwear' },
    { label: 'Kitchen', icon: <FiCoffee size={28} />, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100', href: '/products?category=Kitchen' },
    { label: 'Accessories', icon: <FiWatch size={28} />, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100', href: '/products?category=Accessories' },
    { label: 'Books', icon: <FiBook size={28} />, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-100', href: '/products?category=Books' },
    { label: 'Home', icon: <FiHome size={28} />, color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-100', href: '/products?category=Home' },
];

const FeaturedCategories = () => {
    return (
        <section className="w-full py-20 px-4 bg-white">
            <div className="mx-auto max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.45 }} className="text-center mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Browse by Category
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">Find What You Need</h2>
                    <p className="text-zinc-500 text-base max-w-xl mx-auto">Browse our curated selection across popular categories.</p>
                </motion.div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((cat, i) => (
                        <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                            <Link href={cat.href} className={`flex flex-col items-center gap-3 p-6 rounded-2xl border ${cat.bg} hover:shadow-md transition-all duration-200 hover:-translate-y-1 group`}>
                                <div className={`${cat.color} transition-transform group-hover:scale-110`}>{cat.icon}</div>
                                <span className="text-sm font-semibold text-zinc-700">{cat.label}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;