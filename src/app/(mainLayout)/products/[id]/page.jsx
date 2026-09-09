'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPackage, FiShoppingCart, FiTag } from 'react-icons/fi';
import { Button, Chip } from '@heroui/react';
import { api } from '@/lib/api';

const ProductDetailPage = ({ params }) => {
    const resolvedParams = use(params);
    const id = resolvedParams.id;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(setProduct)
            .catch(() => router.replace('/products'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const isOwner = user && product?.sellerId && user.id === product.sellerId;
    const isAdmin = user?.role === 'admin';
    const outOfStock = product?.stock === 0;
    const cannotBuy = isAdmin || isOwner;
    const isButtonDisabled = outOfStock || cannotBuy;

    async function handleAddToCart(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }

        if (!user) {
            router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${id}`)}`);
            return;
        }

        if (isAdmin) {
            return toast.error('Admins cannot purchase products');
        }

        if (isOwner) {
            return toast.error('You cannot buy your own product');
        }

        try {
            await addToCart(product._id, qty);
            toast.success(`${product.name} added to cart`);
        }
        catch (err) { toast.error(err.message); }
    }

    if (loading) {
        return <LoadingSpinner />;
    }
    if (!product) {
        return null;
    }

    let btnLabel = 'Add to Cart';
    if (outOfStock) btnLabel = 'Out of Stock';
    else if (isOwner) btnLabel = 'Your Product';
    else if (isAdmin) btnLabel = 'Admin View';
    else if (!user) btnLabel = 'Login to Buy';

    return (
        <div className="max-w-6xl mx-auto w-full px-4 py-10">
            <div className="mb-8">
                <Link href="/products" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition">
                    <FiArrowLeft size={14} /> Back to Products
                </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                    className="rounded-2xl overflow-hidden border border-zinc-200 aspect-square bg-zinc-50">
                    <img src={product.image || 'https://placehold.co/600x600/f1f5f9/94a3b8?text=No+Image'} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-6">
                    <div>
                        <Chip size="sm" variant="flat" className="mb-3 bg-blue-50 text-blue-600 border-blue-100">
                            <span className="flex items-center gap-1"><FiTag size={11} /> {product.category}</span>
                        </Chip>
                        <h1 className="text-3xl font-extrabold text-zinc-900 leading-tight">{product.name}</h1>
                    </div>
                    <p className="text-4xl font-extrabold text-blue-600">${parseFloat(product.price).toFixed(2)}</p>
                    <p className="text-zinc-600 leading-relaxed text-base">{product.description || 'No description available.'}</p>
                    <div className="flex items-center gap-2">
                        <FiPackage size={16} className={product.stock > 0 ? 'text-emerald-500' : 'text-red-500'} />
                        <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                    </div>
                    {
                        product.stock > 0 && !cannotBuy && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-zinc-600">Quantity:</span>
                                <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-zinc-600 hover:bg-zinc-100 transition font-bold">−</button>
                                    <span className="px-4 py-2 text-sm font-semibold min-w-10 text-center">{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-zinc-600 hover:bg-zinc-100 transition font-bold">+</button>
                                </div>
                            </div>
                        )
                    }

                    {isOwner && (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                            <span className="text-amber-500 text-base">⚠</span>
                            <p className="text-xs text-amber-700 font-medium">This is your product. You cannot purchase your own listing.</p>
                        </div>
                    )}

                    {!isOwner && user?.role === 'admin' && (
                        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
                            <span className="text-zinc-400 text-base">ℹ</span>
                            <p className="text-xs text-zinc-500 font-medium">Admins cannot purchase products. Switch to a customer account to buy.</p>
                        </div>
                    )}

                    <Button
                        className={`h-12 font-bold rounded-xl transition shadow-lg ${isButtonDisabled ? 'bg-zinc-100 text-zinc-400 shadow-none cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200/50'}`}
                        onPress={handleAddToCart}
                        isDisabled={isButtonDisabled}
                    >
                        <FiShoppingCart size={18} className="mr-2" />
                        {btnLabel}
                    </Button>
                    {
                        user && !cannotBuy && <Link href="/cart" className="text-center text-sm text-blue-600 hover:underline font-medium">View Cart →</Link>
                    }
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetailPage;