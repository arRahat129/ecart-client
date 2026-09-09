'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { api } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/products?status=approved&limit=8')
            .then(data => setProducts(data.products ?? []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && products.length === 0) return null;

    return (
        <section className="w-full py-20 px-4 bg-zinc-50/50 dark:bg-zinc-900/40">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                    className="flex items-end justify-between mb-10 gap-4"
                >
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                            New Arrivals
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
                            Featured Products
                        </h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-xl">
                            Handpicked from our latest approved listings — fresh from the community.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="shrink-0 hidden sm:flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition group"
                    >
                        View All <FiArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse aspect-[3/4]" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
                    >
                        {products.map(product => (
                            <motion.div
                                key={product._id}
                                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="mt-8 text-center sm:hidden">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition group"
                    >
                        View All Products <FiArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}