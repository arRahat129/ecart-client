'use client';

import { React, useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { FiClock, FiPackage, FiX, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: 'warning', processing: 'primary', shipped: 'secondary', delivered: 'success', cancelled: 'danger' };

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STEP_LABELS = { pending: 'Pending', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };

function OrderStepper({ status }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-1 mt-3 mb-1">
                {STEPS.map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                        <div className="flex flex-col items-center gap-0.5">
                            <div className="h-5 w-5 rounded-full bg-zinc-200 flex items-center justify-center">
                                <FiX size={10} className="text-zinc-400" />
                            </div>
                            <span className="text-[9px] text-zinc-400 font-medium whitespace-nowrap">{STEP_LABELS[step]}</span>
                        </div>
                        {i < STEPS.length - 1 && <div className="h-px w-6 bg-zinc-200 mb-3.5" />}
                    </div>
                ))}
                <span className="ml-2 text-xs text-red-500 font-semibold">Cancelled</span>
            </div>
        );
    }

    const currentIdx = STEPS.indexOf(status);
    return (
        <div className="flex items-center gap-1 mt-3 mb-1">
            {STEPS.map((step, i) => {
                const done = i <= currentIdx;
                return (
                    <div key={step} className="flex items-center gap-1">
                        <div className="flex flex-col items-center gap-0.5">
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center transition-colors ${done ? 'bg-blue-600' : 'bg-zinc-200'}`}>
                                {done
                                    ? <FiCheckCircle size={11} className="text-white" />
                                    : <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />}
                            </div>
                            <span className={`text-[9px] font-medium whitespace-nowrap ${done ? 'text-blue-600' : 'text-zinc-400'}`}>{STEP_LABELS[step]}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`h-px w-6 mb-3.5 transition-colors ${i < currentIdx ? 'bg-blue-600' : 'bg-zinc-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function CancelModal({ order, onClose, onCancelled }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!reason.trim()) return toast.error('Please enter a reason');
        setLoading(true);
        try {
            await api.patch(`/orders/${order._id}/cancel-buyer`, { reason });
            toast.success('Order cancelled');
            onCancelled();
            onClose();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-extrabold text-zinc-900">Cancel Order</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition"><FiX size={18} /></button>
                </div>
                <p className="text-sm text-zinc-500 mb-4">
                    Order <span className="font-mono text-zinc-700">{order._id}</span>
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700">Reason for cancellation</label>
                        <textarea
                            rows={3}
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Tell the seller why you're cancelling…"
                            required
                            className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none transition"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button type="button" variant="flat" onPress={onClose} className="font-semibold rounded-xl">Keep Order</Button>
                        <Button type="submit" color="danger" isLoading={loading} className="font-semibold rounded-xl">Confirm Cancel</Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

const CANCEL_BLOCKED = ['shipped', 'delivered', 'cancelled'];


const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelTarget, setCancelTarget] = useState(null);

    useEffect(() => { load(); }, []);

    async function load() {
        try { const data = await api.get('/orders/my'); setOrders(data); }
        catch { setOrders([]); }
        finally { setLoading(false); }
    }

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-zinc-900">My Orders</h1>
                    <p className="text-zinc-500 text-sm mt-1">Track all your purchases</p>
                </div>
                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <FiPackage size={48} className="mx-auto text-zinc-300 mb-4" />
                        <p className="text-zinc-500 text-lg font-medium mb-6">No orders yet</p>
                        <Link href="/products" className="inline-block bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm">Start Shopping</Link>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden" animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
                        className="flex flex-col gap-4"
                    >
                        {orders.map(order => (
                            <motion.div
                                key={order._id}
                                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-sm transition"
                            >
                                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                                    <div>
                                        <p className="text-xs text-zinc-400 font-medium">Order ID</p>
                                        <p className="font-mono text-sm text-zinc-700">{order._id}</p>
                                    </div>
                                    <Chip color={STATUS_COLOR[order.status] || 'default'} size="sm" className="font-semibold capitalize">{order.status}</Chip>
                                </div>

                                {/* ⚡ Order tracking stepper */}
                                <div className="px-5 pt-3">
                                    <OrderStepper status={order.status} />
                                </div>

                                {order.status === 'cancelled' && order.cancellationReason && (
                                    <div className="mx-5 mb-3 mt-1 px-3 py-2 bg-red-50 rounded-xl border border-red-100">
                                        <p className="text-xs text-red-600 font-medium">
                                            Cancelled by {order.cancelledBy ?? 'unknown'}: &quot;{order.cancellationReason}&quot;
                                        </p>
                                    </div>
                                )}

                                <div className="px-5 py-4 flex flex-col gap-1.5">
                                    {order.items.map(item => (
                                        <div key={item.productId} className="flex justify-between text-sm">
                                            <span className="text-zinc-700">{item.name} <span className="text-zinc-400">×{item.quantity}</span></span>
                                            <span className="font-semibold text-zinc-800">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                        <FiClock size={12} />
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <p className="font-extrabold text-blue-600 text-base flex-1 text-right">Total: ${order.total?.toFixed(2)}</p>
                                    {!CANCEL_BLOCKED.includes(order.status) && (
                                        <Button
                                            size="sm" color="danger" variant="flat"
                                            className="font-semibold rounded-xl shrink-0"
                                            onPress={() => setCancelTarget(order)}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {cancelTarget && (
                    <CancelModal
                        order={cancelTarget}
                        onClose={() => setCancelTarget(null)}
                        onCancelled={load}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default MyOrdersPage;