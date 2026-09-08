'use client';
import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();

    async function handleAddToCart(e) {
        e.preventDefault();
        if (!user) {
            return toast.error('Please login to add to cart');
        }
        try {
            await addToCart(product._id, 1);
            toast.success(`${product.name} added to cart`);
        }
        catch (err) { toast.error(err.message); }
    }

    const outOfStock = product.stock === 0;

    return (
        <div className="group bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">
            <Link href={`/products/${product._id}`} className="relative overflow-hidden aspect-square block">
                <img
                    src={product.image || 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {outOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
                <div className="absolute top-2 left-2">
                    <Chip size="sm" variant="flat" className="bg-white/90 text-zinc-600 text-xs font-medium">{product.category}</Chip>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                        <FiEye size={12} /> Quick View
                    </span>
                </div>
            </Link>
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex-1">
                    <Link href={`/products/${product._id}`}>
                        <p className="font-semibold text-zinc-800 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors">{product.name}</p>
                    </Link>
                    <p className="text-xl font-extrabold text-blue-600 mt-1">${parseFloat(product.price).toFixed(2)}</p>
                </div>
                <Button size="sm" className="w-full bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-xl transition" onPress={handleAddToCart} isDisabled={outOfStock}>
                    <FiShoppingCart size={14} className="mr-1.5" />
                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    );
}