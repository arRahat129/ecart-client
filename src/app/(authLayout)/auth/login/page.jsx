'use client';

import React, { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function LoginForm() {
    const { user, loading: authLoading, login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const redirect = searchParams.get('redirect');
    const registerHref = redirect ? `/auth/register?redirect=${encodeURIComponent(redirect)}` : '/auth/register';

    useEffect(() => {
        if (!authLoading && user) {
            router.replace(redirect ?? '/dashboard');
        }
    }, [user, authLoading, router, redirect]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            router.push(redirect ?? '/dashboard');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (authLoading || user) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Welcome back</h1>
                <p className="text-zinc-500 text-sm mt-1">Login to your account</p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-blue-100/20 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Email Address</label>
                        <div className="relative">
                            <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                required
                                className="w-full h-11 pl-9 pr-4 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Password</label>
                        <div className="relative">
                            <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Your password"
                                value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                required
                                className="w-full h-11 pl-9 pr-10 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(s => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition"
                            >
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full h-12 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl shadow-md transition">Login</Button>
                </form>
                <p className="text-center text-sm text-zinc-500 mt-5">
                    No account? <Link href={registerHref} className="text-blue-600 font-semibold hover:underline">Register</Link>
                </p>
            </div>
        </motion.div>
    );
}

const LoginPage = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;