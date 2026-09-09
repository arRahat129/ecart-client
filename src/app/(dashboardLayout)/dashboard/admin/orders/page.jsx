'use client';

import { React, useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { FiEye, FiX, FiPackage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';


const ALL_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLOR = {
    pending: 'warning', processing: 'primary',
    shipped: 'secondary', delivered: 'success', cancelled: 'danger',
};

function OrderModal({ order, onClose }) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-extrabold text-zinc-900">Order Details</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-100 transition"><FiX size={18} /></button>
                </div>

                <div className="flex flex-col gap-1 mb-5 text-sm text-zinc-600">
                    <p><span className="font-semibold text-zinc-800">Order ID:</span> <span className="font-mono">{order._id}</span></p>
                    <p><span className="font-semibold text-zinc-800">Customer ID:</span> {order.customerId}</p>
                    <p><span className="font-semibold text-zinc-800">Placed:</span> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><span className="font-semibold text-zinc-800">Payment:</span> {order.paymentMethod ?? 'COD'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-zinc-800">Status:</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${{
                            pending: 'bg-amber-50 text-amber-700 border-amber-200', processing: 'bg-blue-50 text-blue-700 border-blue-200',
                            shipped: 'bg-violet-50 text-violet-700 border-violet-200', delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            cancelled: 'bg-red-50 text-red-700 border-red-200'
                        }[order.status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-200'
                            }`}>{order.status}</span>
                    </div>
                    {order.cancellationReason && (
                        <p className="text-red-600 mt-1"><span className="font-semibold">Cancel reason ({order.cancelledBy}):</span> {order.cancellationReason}</p>
                    )}
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 mb-5 flex flex-col gap-2">
                    {order.items?.map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-zinc-700">{item.name} <span className="text-zinc-400">×{item.quantity}</span></span>
                            <span className="font-semibold text-zinc-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-extrabold text-zinc-900 text-sm">
                        <span>Total</span>
                        <span>${order.total?.toFixed(2)}</span>
                    </div>
                </div>

                {order.address && (
                    <div className="mb-5 text-sm text-zinc-600">
                        <p className="font-semibold text-zinc-800 mb-1">Delivery Address</p>
                        <p>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</p>
                        <p>{order.address.country} · {order.address.phone}</p>
                    </div>
                )}

                {order.items?.[0]?.sellerName && (
                    <div className="mb-5 text-sm text-zinc-600">
                        <p className="font-semibold text-zinc-800 mb-1">Seller</p>
                        <p>{order.items[0].sellerName}</p>
                    </div>
                )}

                <div className="flex justify-end mt-2">
                    <Button variant="flat" onPress={onClose} className="font-semibold rounded-xl">Close</Button>
                </div>
            </motion.div>
        </div>
    );
}

const FILTER_TABS = ['all', ...ALL_STATUSES];

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [viewOrder, setViewOrder] = useState(null);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await api.get('/orders?limit=100');
            setOrders(data.orders ?? []);
        }
        catch { }
        finally { setLoading(false); }
    }

    const filtered = activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab);

    if (loading) {
        return <LoadingSpinner />;
    }


    return (
        <>
            <div>
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-zinc-900">All Orders</h1>
                    <p className="text-zinc-500 text-sm mt-1">View and manage every order</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition capitalize ${activeTab === tab
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-zinc-600 border-zinc-200 hover:border-blue-300'
                                }`}
                        >
                            {tab === 'all' ? `All (${orders.length})` : `${tab} (${orders.filter(o => o.status === tab).length})`}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <FiPackage size={40} className="mx-auto text-zinc-300 mb-3" />
                        <p className="text-zinc-500 text-sm">No orders in this category</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden" animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
                        className="flex flex-col gap-3"
                    >
                        {filtered.map(order => (
                            <motion.div
                                key={order._id}
                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25 } } }}
                                className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center justify-between gap-4 hover:shadow-sm transition"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-mono text-xs text-zinc-400 truncate">{order._id}</p>
                                    <p className="font-semibold text-zinc-800 mt-0.5 text-sm">Customer: {order.customerId}</p>
                                    <p className="text-sm text-zinc-500">
                                        ${order.total?.toFixed(2)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-zinc-400 mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Chip color={STATUS_COLOR[order.status] || 'default'} size="sm" className="font-semibold capitalize">
                                        {order.status}
                                    </Chip>

                                    <Button
                                        size="sm" variant="flat" className="font-semibold rounded-xl flex items-center gap-1.5"
                                        onPress={() => setViewOrder(order)}
                                    >
                                        <FiEye size={13} /> View
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {viewOrder && (
                    <OrderModal
                        order={viewOrder}
                        onClose={() => setViewOrder(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminOrderPage;