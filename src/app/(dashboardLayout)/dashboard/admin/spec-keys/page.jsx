'use client';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Footwear', 'Kitchen', 'Accessories', 'Books', 'Home', 'Other'];

export default function SpecKeysPage() {
    const [keys, setKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCat, setFilterCat] = useState('Electronics');
    const [newKey, setNewKey] = useState('');
    const [newCat, setNewCat] = useState('Electronics');
    const [adding, setAdding] = useState(false);

    useEffect(() => { load(); }, [filterCat]);
    async function load() {
        setLoading(true);
        try {
            const data = await api.get(`/spec-keys?category=${filterCat}`);
            setKeys(data);
        }
        catch {
            setKeys([]);
        }
        finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newKey.trim()) {
            return;
        }
        setAdding(true);
        try {
            await api.post('/spec-keys', {
                category: newCat,
                key: newKey.trim()
            });
            toast.success('Spec key created');
            setNewKey('');
            load();
        }
        catch (err) {
            toast.error(err.message);
        }
        finally {
            setAdding(false);
        }
    }

    async function handleDelete(id) {
        try {
            await api.delete(`/spec-keys/${id}`);
            setKeys(prev => prev.filter(k => String(k._id) !== id));
        }
        catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Specification Keys</h1>
                <p className="text-zinc-500 text-sm mt-1">Define spec fields per category. Sellers fill in values when listing products.</p>
            </div>
            <form onSubmit={handleCreate} className="bg-white border border-zinc-200 rounded-2xl p-5 mb-6 flex gap-2">
                <select value={newCat} onChange={e => setNewCat(e.target.value)}
                    className="h-10 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none transition bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Spec key (e.g. Battery Capacity)" value={newKey}
                    onChange={e => setNewKey(e.target.value)} required
                    className="flex-1 h-10 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                <Button type="submit" isLoading={adding} size="sm" className="bg-blue-600 text-white font-semibold rounded-xl px-4">
                    <FiPlus size={14} className="mr-1" /> Add
                </Button>
            </form>
            <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setFilterCat(c)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${filterCat === c ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-zinc-600 border-zinc-200 hover:border-blue-300'}`}>
                        {c}
                    </button>
                ))}
            </div>
            {loading ? <LoadingSpinner /> : keys.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-10">No spec keys for {filterCat} yet.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {keys.map(k => (
                        <div key={k._id} className="bg-white border border-zinc-200 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-800">{k.key}</span>
                            <button onClick={() => handleDelete(String(k._id))}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition">
                                <FiTrash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}