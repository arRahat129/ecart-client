'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

const STAT_CONFIG = [
    { key: 'products', label: 'Products', suffix: '+' },
    { key: 'customers', label: 'Happy Customers', suffix: '+' },
    { key: 'orders', label: 'Orders Placed', suffix: '+' },
    { key: null, value: '24/7', label: 'Support', suffix: '' },
];

function formatCount(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
}

const StatsBar = () => {
    const [liveStats, setLiveStats] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        api.get('/stats/public')
            .then(data => { setLiveStats(data); setLoaded(true); })
            .catch(() => setLoaded(true));
    }, []);

    const stats = STAT_CONFIG.map(s => ({
        label: s.label,
        value: s.key
            ? loaded
                ? liveStats
                    ? `${formatCount(liveStats[s.key])}${s.suffix}`
                    : '—'
                : '…'
            : s.value,
    }));

    return (
        <section className="w-full border-y border-blue-50 bg-blue-50/30 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="text-center"
                        >
                            <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsBar;
