'use client';
import Link from 'next/link';
import { Card, Button } from '@heroui/react';
import { motion } from 'framer-motion';
import { FiZap, FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiStar } from 'react-icons/fi';

const benefits = [
    { icon: <FiTruck className="text-sky-500" size={24} />, title: 'Fast Delivery', description: 'Free shipping on orders over $50. Express options available at checkout.' },
    { icon: <FiShield className="text-indigo-500" size={24} />, title: 'Secure Payments', description: 'Your payment information is protected with bank-level encryption.' },
    { icon: <FiRefreshCw className="text-emerald-500" size={24} />, title: 'Easy Returns', description: '30-day hassle-free return policy on all products, no questions asked.' },
    { icon: <FiZap className="text-blue-500" size={24} />, title: 'Lightning Checkout', description: 'Save your address and pay in seconds — no re-entering details.' },
    { icon: <FiHeadphones className="text-violet-500" size={24} />, title: '24/7 Support', description: 'Our team is always ready to help you via live chat or email.' },
    { icon: <FiStar className="text-amber-500" size={24} />, title: 'Curated Products', description: 'Every product is reviewed and quality-checked before being listed.' },
];

const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const iv = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 110, damping: 15 } } };

const WhyChooseUs = () => {
    return (
        <section className="w-full relative overflow-hidden bg-zinc-50/50 py-20 px-4">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="mx-auto max-w-7xl relative z-10">
                <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.45 }} className="text-center max-w-3xl mx-auto mb-14 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-200/50 bg-sky-50 text-sky-600 text-xs font-semibold uppercase tracking-wider">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" /> Why eCart
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
                        Shopping Should Be{' '}
                        <span className="bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">Effortless</span>
                    </h2>
                    <p className="text-zinc-500 text-base md:text-lg">We built eCart with one goal — make every purchase fast, safe, and enjoyable.</p>
                </motion.div>
                <motion.div variants={cv} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((b, i) => (
                        <Card key={i} shadow="none" className="bg-white border border-zinc-200 hover:border-sky-400/40 hover:shadow-lg transition-all duration-300 p-6 rounded-xl">
                            <motion.div variants={iv} className="flex flex-col gap-4">
                                <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shadow-sm">{b.icon}</div>
                                <div><h3 className="text-lg font-bold text-zinc-800 mb-1">{b.title}</h3><p className="text-sm text-zinc-500 leading-relaxed">{b.description}</p></div>
                            </motion.div>
                        </Card>
                    ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                    <p className="text-sm font-medium text-zinc-600">Ready to start shopping?</p>
                    <Link href="/products">
                        <Button className="font-semibold text-sm bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/10 h-11 px-7 rounded-lg">Browse Products</Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

export default WhyChooseUs;