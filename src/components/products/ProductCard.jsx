'use client';
import Link from 'next/link';
import { Button, Chip } from '@heroui/react';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const isOwner = user && product.sellerId && user.id === product.sellerId;
    const isAdmin = user?.role === 'admin';
    const outOfStock = product.stock === 0;

    async function handleAddToCart(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation();
        }

        if (!user) {
            router.push(`/auth/login?redirect=/products/${product._id}`);
            return;
        }
        if (isAdmin) {
            return toast.error('Admins cannot purchase products');
        }
        if (isOwner) {
            return toast.error('You cannot buy your own product');
        }
        try {
            await addToCart(product._id, 1);
            toast.success(`${product.name} added to cart`);
        }
        catch (err) { toast.error(err.message); }
    }

    let btnLabel = outOfStock ? 'Out of Stock' : 'Add to Cart';
    if (isOwner) btnLabel = 'Your Product';
    if (isAdmin) btnLabel = 'Admin View';

    const isDisabled = (isOwner || isAdmin || outOfStock);

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
                <Button
                    size="sm"
                    className={`w-full rounded-xl transition font-semibold ${isDisabled ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    onPress={handleAddToCart}
                    isDisabled={isDisabled}
                >
                    <FiShoppingCart size={14} className="mr-1.5" />
                    {btnLabel}
                </Button>
            </div>
        </div>
    );
}