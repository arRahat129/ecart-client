'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@heroui/react';
import { FiPackage, FiShoppingBag, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, Legend,
} from 'recharts';

const SHIPPED_STATUSES = ['shipped', 'delivered'];

export default function CustomerDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [myProducts, mySales, myOrders] = await Promise.all([
                    api.get('/products?sellerId=me&limit=200'),
                    api.get('/orders/my-sales'),
                    api.get('/orders/my'),
                ]);

                const allProducts = myProducts.products ?? myProducts ?? [];
                const totalAdded = allProducts.length;
                const totalApproved = allProducts.filter(p => p.status === 'approved').length;

                const soldCount = (mySales ?? []).filter(o => SHIPPED_STATUSES.includes(o.status)).length;

                const boughtCount = (myOrders ?? []).filter(o => SHIPPED_STATUSES.includes(o.status)).length;

                setStats({ totalAdded, totalApproved, soldCount, boughtCount });
            } catch { }
            finally { setLoading(false); }
        }
        load();
    }, []);

    const cards = [
        { label: 'Added Products', value: stats?.totalAdded ?? '—', icon: FiPackage, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Approved Products', value: stats?.totalApproved ?? '—', icon: FiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Products Sold', value: stats?.soldCount ?? '—', icon: FiShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Products Bought', value: stats?.boughtCount ?? '—', icon: FiShoppingCart, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const chartData = stats
        ? [
            { name: 'Added', value: stats.totalAdded, fill: '#3b82f6' },
            { name: 'Approved', value: stats.totalApproved, fill: '#10b981' },
            { name: 'Sold', value: stats.soldCount, fill: '#8b5cf6' },
            { name: 'Bought', value: stats.boughtCount, fill: '#f97316' },
        ]
        : [];
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-zinc-500 text-sm mt-1">Your activity overview</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div key={card.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.07 }}>
                            <Card className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-row items-center gap-4 hover:shadow-sm transition" shadow="none">
                                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                                    <Icon size={18} className={card.color} />
                                </div>
                                <div>
                                    <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wide leading-tight">{card.label}</p>
                                    <p className="text-2xl font-extrabold text-zinc-900">{loading ? '—' : card.value}</p>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {!loading && stats && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                    <Card className="bg-white border border-zinc-200 rounded-2xl p-6" shadow="none">
                        <p className="font-bold text-zinc-800 text-sm mb-5">Product & Order Summary</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barCategoryGap="40%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Count">
                                    {chartData.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}