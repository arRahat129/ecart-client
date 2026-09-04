'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { value: '10K+', label: 'Products' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
];

const StatsBar = () => {
    return (
        <section className="w-full border-y border-blue-50 bg-blue-50/30 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {
                        stats.map((stat, i) => (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="text-center">
                                <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
};

export default StatsBar;
