'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button, Spinner } from '@heroui/react';
import { FiEye, FiEyeOff, FiImage, FiLink, FiLock, FiMail, FiUpload, FiUser, FiX } from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

async function uploadToImgBB(file) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error('NEXT_PUBLIC_IMGBB_API_KEY not set');
    }
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error?.message || 'Upload failed');
    }
    return data.data.url;
}

function AvatarUploader({ value, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const fileRef = useRef(null);

    async function handleFile(file) {
        if (!file?.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        setUploading(true);
        try {
            const url = await uploadToImgBB(file);
            onChange(url);
            toast.success('Image uploaded');
        }
        catch (err) {
            toast.error(err.message);
        }
        finally { setUploading(false); }
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) {
            handleFile(f);
        }
    }
    function applyUrl() {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput('');
            toast.success('Image URL applied');
        }
    }

    if (value) {
        return (
            <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Profile Picture</p>
                <div className="relative">
                    <img src={value} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md" />
                    <button type="button" onClick={() => onChange('')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow">
                        <FiX size={12} />
                    </button>
                </div>
                <p className="text-xs text-zinc-400">Click × to remove and choose another</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Profile Picture <span className="font-normal normal-case">(optional)</span>
            </p>

            <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition gap-2 ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-zinc-200 hover:border-blue-400 hover:bg-blue-50/30'}`}
            >
                {uploading
                    ? <Spinner size="md" />
                    : (<><FiImage size={24} className="text-zinc-400" /><p className="text-sm text-zinc-500 font-medium">Click or drag & drop</p><p className="text-xs text-zinc-400">PNG, JPG, WEBP</p></>)
                }
            </div>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

            <Button type="button" variant="flat" size="sm" onPress={() => fileRef.current?.click()} isLoading={uploading} className="w-full flex items-center justify-center gap-2">
                <FiUpload size={13} /> Upload from Device
            </Button>

            <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                    <FiLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Or paste image URL..."
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl(); } }}
                        className="w-full h-9 pl-9 pr-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>
                <Button type="button" size="sm" variant="flat" onPress={applyUrl} isDisabled={!urlInput.trim()} className="shrink-0">Apply</Button>
            </div>
        </div>
    );
}

function RegisterForm() {
    const { user, loading: authLoading, register } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({ name: '', email: '', password: '', image: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const redirect = searchParams.get('redirect');
    const loginHref = redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login';

    useEffect(() => {
        if (!authLoading && user) {
            router.replace(redirect ?? '/dashboard');
        }
    }, [user, authLoading, router, redirect]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.image);
            toast.success('Account created! Please login.');
            router.push(loginHref);
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    if (authLoading || user) return null;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Create your account</h1>
                <p className="text-zinc-500 text-sm mt-1">Start shopping in seconds</p>
            </div>
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl shadow-blue-100/20 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Full Name</label>
                        <div className="relative">
                            <FiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                required
                                className="w-full h-11 pl-9 pr-4 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                            />
                        </div>
                    </div>

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

                    <AvatarUploader value={form.image} onChange={url => setForm(p => ({ ...p, image: url }))} />

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Password</label>
                        <div className="relative">
                            <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 characters"
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

                    <Button type="submit" isLoading={loading} className="w-full h-12 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-xl shadow-md transition">
                        Create Account
                    </Button>
                </form>
                <p className="text-center text-sm text-zinc-500 mt-5">
                    Already have an account? <Link href={loginHref} className="text-blue-600 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </motion.div>
    );
}

const RegisterPage = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <RegisterForm />
        </Suspense>
    );
};

export default RegisterPage;