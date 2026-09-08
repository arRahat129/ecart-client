'use client';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import ImageUploader from '@/components/ui/ImageUploader';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CATEGORIES = ['Electronics', 'Footwear', 'Kitchen', 'Accessories', 'Books', 'Home', 'Other'];
const EMPTY = { name: '', description: '', price: '', category: '', stock: '', image: '' };

const SubmitProductPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(false);

    function set(key, value) { setForm(p => ({ ...p, [key]: value })); }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.image) return toast.error('Please upload a product image');
        setLoading(true);
        try {
            await api.post('/products', {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock) || 0,
                status: 'pending',
                sellerId: user._id ?? user.id,
                sellerName: user.name,
            });
            toast.success('Product submitted for review!');
            router.push('/dashboard/customer/my-products');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Submit a Product</h1>
                <p className="text-zinc-500 text-sm mt-1">Fill in the details. Your product will be reviewed by an admin before going live.</p>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-7 flex flex-col gap-5">

                <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Product Image <span className="text-red-500">*</span></label>
                    <ImageUploader value={form.image} onUpload={url => set('image', url)} label="" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="e.g. Wireless Noise-Cancelling Headphones" value={form.name} onChange={e => set('name', e.target.value)} required
                        className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Description</label>
                    <textarea placeholder="Describe your product clearly..." value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                        className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700">Price ($) <span className="text-red-500">*</span></label>
                        <input type="number" min="0" step="0.01" placeholder="29.99" value={form.price} onChange={e => set('price', e.target.value)} required
                            className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700">Stock Quantity</label>
                        <input type="number" min="0" placeholder="0" value={form.stock} onChange={e => set('stock', e.target.value)}
                            className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Category <span className="text-red-500">*</span></label>
                    <select value={form.category} onChange={e => set('category', e.target.value)} required
                        className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition bg-white">
                        <option value="">Select a category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                    <span className="text-blue-500 mt-0.5 text-base">ℹ</span>
                    <p className="text-xs text-blue-700 leading-relaxed">
                        Your product will be submitted with status <strong>Pending</strong>. An admin will review and approve or reject it. Approved products become visible to all shoppers.
                    </p>
                </div>

                <Button type="submit" isLoading={loading} className="h-12 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200/50 transition">
                    Submit for Review
                </Button>
            </motion.form>
        </div>
    );
}

export default SubmitProductPage;