'use client';

import { React, useState, useEffect } from 'react';
import { Chip } from '@heroui/react';
import { FiClock, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';

const STATUS_COLOR = { pending: 'warning', processing: 'primary', shipped: 'secondary', delivered: 'success', cancelled: 'danger' };

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        api.get('/orders/my').then(setOrders).finally(() => setLoading(false));
    }, []);
    if (loading) return <LoadingSpinner />;

    return (
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
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }} className="flex flex-col gap-4">
                    {orders.map(order => (
                        <motion.div key={order._id} variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                            className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-sm transition">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
                                <div>
                                    <p className="text-xs text-zinc-400 font-medium">Order ID</p>
                                    <p className="font-mono text-sm text-zinc-700">{order._id}</p>
                                </div>
                                <Chip color={STATUS_COLOR[order.status] || 'default'} size="sm" className="font-semibold capitalize">{order.status}</Chip>
                            </div>
                            <div className="px-5 py-4 flex flex-col gap-1.5">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-zinc-700">{item.name} <span className="text-zinc-400">×{item.quantity}</span></span>
                                        <span className="font-semibold text-zinc-800">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-t border-zinc-100">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                    <FiClock size={12} />
                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <p className="font-extrabold text-blue-600 text-base">Total: ${order.total?.toFixed(2)}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default MyOrdersPage;