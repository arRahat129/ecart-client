'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@heroui/react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartItem from '@/components/cart/CartItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const CartPage = () => {
    const { cart, totalPrice } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return (
            <div className="flex-1 flex items-center justify-center py-20">
                <div className="text-center">
                    <FiShoppingCart size={48} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-zinc-500 text-lg font-medium mb-6">Please login to view your cart.</p>
                    <Link href="/auth/login"><Button className="bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">Login</Button></Link>
                </div>
            </div>
        );
    }

    const items = Array.isArray(cart?.items) ? cart.items : [];

    return (
        <div className="max-w-3xl mx-auto w-full px-4 py-10">
            <h1 className="text-2xl font-extrabold text-zinc-900 mb-8">Your Cart</h1>
            {items.length === 0 ? (
                <div className="text-center py-20">
                    <FiShoppingCart size={48} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-zinc-500 text-lg font-medium mb-6">Your cart is empty</p>
                    <Link href="/products"><Button className="bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">Browse Products</Button></Link>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 mb-6">
                        {items.map(item => <CartItem key={item.productId} item={item} />)}
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-zinc-900">Total: ${totalPrice.toFixed(2)}</p>
                        <Button className="h-12 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200/50 px-8 transition" onPress={() => router.push('/checkout')}>
                            Proceed to Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;