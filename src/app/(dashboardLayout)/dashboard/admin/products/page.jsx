'use client';
import { useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLOR = { pending: 'warning', approved: 'success', rejected: 'danger' };

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await api.get('/products?limit=100&status=pending');
            setProducts(data.products);
        }
        catch { }
        finally { setLoading(false); }
    }

    async function setStatus(id, status) {
        try {
            await api.patch(`/products/${id}/status`, { status });
            toast.success(`Product ${status}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) { toast.error(err.message); }
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Product Approvals</h1>
                <p className="text-zinc-500 text-sm mt-1">Review pending product submissions</p>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-zinc-500 text-lg font-medium">No pending submissions</p>
                    <p className="text-zinc-400 text-sm mt-1">All products have been reviewed.</p>
                </div>
            ) : (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }} className="flex flex-col gap-3">
                    {products.map(product => (
                        <motion.div key={product._id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                            className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center gap-5 hover:shadow-sm transition">
                            <img src={product.image || 'https://placehold.co/72x72/f1f5f9/94a3b8?text=?'} alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover border border-zinc-100 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-zinc-800">{product.name}</p>
                                <p className="text-sm text-zinc-500 mt-0.5">{product.category} · ${parseFloat(product.price).toFixed(2)} · Stock: {product.stock}</p>
                                {product.sellerName && <p className="text-xs text-zinc-400 mt-1">Submitted by {product.sellerName}</p>}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Chip size="sm" color={STATUS_COLOR[product.status] ?? 'default'} className="font-semibold capitalize">{product.status}</Chip>
                                {product.status === 'pending' && (
                                    <>
                                        <Button size="sm" className="bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition" onPress={() => setStatus(product._id, 'approved')}>Approve</Button>
                                        <Button size="sm" variant="flat" color="danger" className="font-semibold rounded-xl" onPress={() => setStatus(product._id, 'rejected')}>Reject</Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}