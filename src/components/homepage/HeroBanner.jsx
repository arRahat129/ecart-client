'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiZap, FiTruck } from 'react-icons/fi';

const container = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
};
const item = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
};

const HeroBanner = () => {
    return (
        <section className="relative w-full overflow-hidden py-24 md:py-36 border-b border-blue-100/50">
            <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-50 via-white to-indigo-50" />
            <div className="absolute top-1/2 left-1/2 -z-10 h-96 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div variants={container} initial="hidden" animate="visible" className="mx-auto max-w-4xl text-center space-y-8">
                    <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                        <FiZap className="text-blue-500 animate-pulse" size={13} /> Free delivery on orders over $50
                    </motion.div>
                    <motion.h1 variants={item} className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                        Shop Smarter.{' '}
                        <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-blue-400 bg-clip-text text-transparent">Live Better.</span>
                    </motion.h1>
                    <motion.p variants={item} className="mx-auto max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
                        Discover thousands of products across electronics, fashion, kitchen and more — all in one place, with fast checkout and easy returns.
                    </motion.p>
                    <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                        <Link href="/products">
                            <Button className="h-12 w-full sm:w-auto bg-blue-600 text-white font-semibold px-8 hover:bg-blue-700 shadow-lg shadow-blue-200/60 rounded-xl transition group" endContent={<FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}>Shop Now</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button variant="bordered" className="h-12 w-full sm:w-auto border-blue-200 font-semibold text-slate-700 hover:bg-blue-50/50 px-8 rounded-xl" startContent={<FiShoppingBag size={16} />}>Create Account</Button>
                        </Link>
                    </motion.div>
                    <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500 font-medium">
                        {[{ icon: <FiTruck size={14} />, label: 'Free Shipping $50+' }, { icon: <FiZap size={14} />, label: 'Fast Checkout' }, { icon: <FiShoppingBag size={14} />, label: 'Easy Returns' }].map(({ icon, label }) => (
                            <span key={label} className="flex items-center gap-1.5"><span className="text-blue-500">{icon}</span>{label}</span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroBanner;