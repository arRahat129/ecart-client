'use client';
import { useState, useEffect, use } from 'react';
import { Button } from '@heroui/react';
import { api } from '@/lib/api';
import ImageUploader from '@/components/ui/ImageUploader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CATEGORIES = ['Electronics', 'Footwear', 'Kitchen', 'Accessories', 'Books', 'Home', 'Other'];

const EditProductPage = ({ params }) => {
    const resolvedParams = use(params);
    const id = resolvedParams.id;


    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '', image: '' });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (!id) return;
        api.get(`/products/${id}`)
            .then(p => {
                setProduct(p);
                setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, stock: String(p.stock), image: p.image });
            })
            .catch(() => router.replace('/dashboard/customer/my-products'))
            .finally(() => setFetching(false));
    }, [id, router]);

    function set(key, value) { setForm(p => ({ ...p, [key]: value })); }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch(`/products/${id}`, {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                category: form.category,
                stock: parseInt(form.stock) || 0,
                image: form.image,
            });
            toast.success('Product updated!');
            router.push('/dashboard/customer/my-products');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    }

    if (fetching) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <button onClick={() => router.back()} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition mb-3 block">← Back</button>
                <h1 className="text-2xl font-extrabold text-zinc-900">Edit Product</h1>
                <p className="text-zinc-500 text-sm mt-1">Update your product details. Status is managed by admin.</p>
            </div>

            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-7 flex flex-col gap-5">

                <div>
                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Product Image</label>
                    <ImageUploader value={form.image} onUpload={url => set('image', url)} label="" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Product Name <span className="text-red-500">*</span></label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required
                        className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700">Description</label>
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                        className="px-3 py-2.5 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700">Price ($) <span className="text-red-500">*</span></label>
                        <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} required
                            className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-zinc-700">Stock Quantity</label>
                        <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)}
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

                <div className="flex gap-3">
                    <Button type="submit" isLoading={loading} className="flex-1 h-12 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200/50 transition">
                        Save Changes
                    </Button>
                    <Button type="button" variant="flat" className="h-12 px-6 font-semibold rounded-xl" onPress={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </motion.form>
        </div>
    );
}

export default EditProductPage;