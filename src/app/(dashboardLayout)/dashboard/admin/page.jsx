'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card } from '@heroui/react';
import { FiPackage, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats/admin')
            .then((res) => {
                const data = res?.data ?? res;
                setStats(data);
            })
            .catch((err) => {
                console.error("Failed to fetch admin stats:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const chartData = stats
        ? stats.chart.labels.map((label, i) => ({
            date: label,
            users: stats.chart.dailyUsers[i],
            products: stats.chart.dailyProducts[i],
            orders: stats.chart.dailyOrders[i],
        }))
        : [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-zinc-500 text-sm mt-1">Store overview — last 7 days</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-row items-center gap-5 mb-8 w-fit" shadow="none">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <FiUsers size={22} className="text-purple-500" />
                    </div>
                    <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">Total Users</p>
                        <p className="text-3xl font-extrabold text-zinc-900 mt-0.5">
                            {loading ? '—' : stats?.totalUsers ?? '—'}
                        </p>
                    </div>
                </Card>
            </motion.div>

            {
                loading ? (
                    <div className="text-zinc-400 text-sm py-12 text-center">Loading charts…</div>
                ) : (
                    <div className="flex flex-col gap-8">
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
                            <Card className="bg-white border border-zinc-200 rounded-2xl p-6" shadow="none">
                                <div className="flex items-center gap-2 mb-5">
                                    <FiUsers size={16} className="text-purple-500" />
                                    <p className="font-bold text-zinc-800 text-sm">Daily New Users</p>
                                </div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                                        <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} name="New Users" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
                            <Card className="bg-white border border-zinc-200 rounded-2xl p-6" shadow="none">
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex items-center gap-1.5">
                                        <FiPackage size={14} className="text-blue-500" />
                                        <p className="font-bold text-zinc-800 text-sm">Daily Products Added</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FiShoppingBag size={14} className="text-emerald-500" />
                                        <p className="font-bold text-zinc-800 text-sm">Daily Orders Placed</p>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <BarChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barCategoryGap="30%">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                                        <Bar dataKey="products" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Products Added" />
                                        <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} name="Orders Placed" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </motion.div>
                    </div>
                )
            }
        </div>
    );
}