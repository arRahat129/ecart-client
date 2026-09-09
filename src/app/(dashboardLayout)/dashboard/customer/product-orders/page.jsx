'use client';
import { useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { FiClock, FiPackage, FiX, FiEye } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_COLOR = { pending: 'warning', processing: 'primary', shipped: 'secondary', delivered: 'success', cancelled: 'danger' };

const CANCEL_BLOCKED = ['shipped', 'delivered', 'cancelled'];

function SellerCancelModal({ order, onClose, onCancelled }) {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!reason.trim()) return toast.error('Please enter a reason');
        setLoading(true);
        try {
            await api.patch(`/orders/${order._id}/cancel-seller`, { reason });
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
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.18 }}
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
                            placeholder="Tell the buyer why you're cancelling…"
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

function OrderModal({ order, onClose, onAction, actioning, onCancelClick }) {
    const canAct = order.status === 'pending';
    const canCancel = !CANCEL_BLOCKED.includes(order.status);

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

                <div className="flex flex-col gap-1 mb-4 text-sm text-zinc-600">
                    <p><span className="font-semibold text-zinc-800">Order ID:</span> <span className="font-mono">{order._id}</span></p>
                    <p><span className="font-semibold text-zinc-800">Placed:</span> {new Date(order.createdAt).toLocaleString()}</p>
                    <p><span className="font-semibold text-zinc-800">Payment:</span> {order.paymentMethod ?? 'COD'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-zinc-800">Status:</span>
                        <Chip size="sm" color={STATUS_COLOR[order.status] || 'default'} className="font-semibold capitalize">{order.status}</Chip>
                    </div>
                    {order.status === 'cancelled' && order.cancellationReason && (
                        <p className="mt-1 text-red-600 text-xs">
                            Cancelled by {order.cancelledBy ?? 'unknown'}: &quot;{order.cancellationReason}&quot;
                        </p>
                    )}
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 mb-4 flex flex-col gap-2">
                    {order.items?.map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                            <span className="text-zinc-700">{item.name} <span className="text-zinc-400">×{item.quantity}</span></span>
                            <span className="font-semibold text-zinc-800">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-zinc-200 flex justify-between font-extrabold text-zinc-900 text-sm">
                        <span>Total</span>
                        <span>${order.items?.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                    </div>
                </div>

                {order.address && (
                    <div className="mb-5 text-sm text-zinc-600">
                        <p className="font-semibold text-zinc-800 mb-1">Delivery Address</p>
                        <p>{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</p>
                        <p>{order.address.country} · {order.address.phone}</p>
                    </div>
                )}

                <div className="flex flex-wrap gap-3 justify-end border-t border-zinc-100 pt-4">
                    <Button variant="flat" onPress={onClose} className="font-semibold rounded-xl">Close</Button>

                    {canCancel && (
                        <Button
                            color="danger" variant="flat"
                            className="font-semibold rounded-xl"
                            onPress={() => onCancelClick(order)}
                        >
                            Cancel Order
                        </Button>
                    )}

                    {canAct && (
                        <>
                            <Button
                                color="danger" variant="flat" isLoading={actioning}
                                className="font-semibold rounded-xl"
                                onPress={() => onAction('cancelled')}
                            >
                                Reject
                            </Button>
                            <Button
                                color="success" isLoading={actioning}
                                className="font-semibold rounded-xl text-white"
                                onPress={() => onAction('processing')}
                            >
                                Accept Order
                            </Button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

const ProductOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [cancelTarget, setCancelTarget] = useState(null);
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
            toast.success(status === 'processing' ? 'Order accepted! Stock reduced.' : 'Order rejected');
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
        <>
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-zinc-900">Product Orders</h1>
                    <p className="text-zinc-500 text-sm mt-1">Orders placed on your products — accept, reject, or cancel</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <FiPackage size={48} className="mx-auto text-zinc-300 mb-4" />
                        <p className="text-zinc-500 text-lg font-medium">No orders on your products yet</p>
                        <p className="text-zinc-400 text-sm mt-1">When customers buy your approved products, orders will appear here.</p>
                    </div>
                ) : (
                    <motion.div
                        initial="hidden" animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
                        className="flex flex-col gap-3"
                    >
                        {orders.map(order => (
                            <motion.div
                                key={order._id}
                                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                                className="bg-white rounded-2xl border border-zinc-200 p-5 flex items-center justify-between gap-4 hover:shadow-sm transition cursor-pointer"
                                onClick={() => setSelected(order)}
                            >
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

            <AnimatePresence>
                {selected && !cancelTarget && (
                    <OrderModal
                        order={selected}
                        onClose={() => setSelected(null)}
                        onAction={handleAction}
                        actioning={actioning}
                        onCancelClick={order => {
                            setCancelTarget(order);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {cancelTarget && (
                    <SellerCancelModal
                        order={cancelTarget}
                        onClose={() => setCancelTarget(null)}
                        onCancelled={() => {
                            setSelected(null);
                            setCancelTarget(null);
                            load();
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default ProductOrdersPage;