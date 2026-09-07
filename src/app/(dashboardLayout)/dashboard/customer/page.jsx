'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Card } from '@heroui/react';
import { FiPackage, FiShoppingBag, FiPlusSquare } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CustomerDashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function loadCustomerStats() {
            try {
                const orders = await api.get('/orders/my');
                setStats({ orders: orders?.length ?? 0 });
            } catch (err) {
                console.error('Failed to load customer stats:', err);
            }
        }
        loadCustomerStats();
    }, []);

    const customerCards = [
        {
            label: 'My Orders',
            value: stats?.orders ?? '—',
            icon: FiShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            href: '/dashboard/orders',
        },
        {
            label: 'Submit Product',
            value: '+',
            icon: FiPlusSquare,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            href: '/dashboard/submit-product',
        },
        {
            label: 'My Submissions',
            value: '→',
            icon: FiPackage,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            href: '/dashboard/my-products',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">
                    Welcome back, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p className="text-zinc-500 text-sm mt-1">What&apos;s happening with your account.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {customerCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: i * 0.08 }}
                        >
                            <Link href={card.href}>
                                <Card
                                    className="bg-white border border-zinc-200 rounded-2xl p-6 flex flex-row items-center gap-5 hover:shadow-md hover:border-blue-200 transition cursor-pointer"
                                    shadow="none"
                                >
                                    <div className={`h-12 w-12 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                                        <Icon size={22} className={card.color} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{card.label}</p>
                                        <p className="text-3xl font-extrabold text-zinc-900 mt-0.5">{card.value}</p>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}