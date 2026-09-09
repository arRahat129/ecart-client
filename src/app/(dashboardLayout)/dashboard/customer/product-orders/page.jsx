'use client';
import { useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { FiClock, FiPackage, FiX, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: 'warning', processing: 'primary', shipped: 'secondary', delivered: 'success', cancelled: 'danger' };

const ProductOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [actioning, setActioning] = useState(false);

    useEffect(() => { load(); }, []);
    async function load() {
        try { const data = await api.get('/orders/my-sales'); setOrders(data); }
        catch { setOrders([]); }
        finally { setLoading(false); }
    }

    async function handleAction(status) {
        setActioning(true);
        try {
            await api.patch(`/orders/${selected._id}/seller-status`, { status });
            toast.success(status === 'processing' ? 'Order accepted!' : 'Order rejected');
            setSelected(prev => ({ ...prev, status }));
            load();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setActioning(false);
        }
    }

    if (loading) return <LoadingSpinner />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Product Orders</h1>
                <p className="text-zinc-500 text-sm mt-1">Orders placed on your products — accept or reject each one</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <FiPackage size={48} className="mx-auto text-zinc-300 mb-4" />
                    <p className="text-zinc-500 text-lg font-medium">No orders on your products yet</p>
                    <p className="text-zinc-400 text-sm mt-1">When customers buy your approved products, orders will appear here.</p>
                </div>
            ) : (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }} className="flex flex-col gap-3">
                    {orders.map(order => (
                        <motion.div key={order._id}
                            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                            className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center justify-between gap-4 hover:shadow-sm transition cursor-pointer"
                            onClick={() => setSelected(order)}>
                            <div className="min-w-0">
                                <p className="font-mono text-xs text-zinc-400 truncate">{order._id}</p>
                                <p className="font-semibold text-zinc-800 mt-0.5 text-sm">{order.items.map(i => i.name).join(', ')}</p>
                                <p className="text-sm text-zinc-500 mt-0.5">
                                    ${order.items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1">
                                    <FiClock size={11} />
                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <Chip size="sm" color={STATUS_COLOR[order.status] || 'default'} className="font-semibold capitalize">{order.status}</Chip>
                                <Button size="sm" variant="flat" className="font-semibold rounded-xl flex items-center gap-1.5">
                                    <FiEye size={13} /> View
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

export default ProductOrdersPage;