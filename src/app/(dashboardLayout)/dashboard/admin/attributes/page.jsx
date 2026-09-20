'use client';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AttributesPage = () => {
    const [attributes, setAttributes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [values, setValues] = useState({});
    const [newName, setNewName] = useState('');
    const [newValueInputs, setNewValueInputs] = useState({});
    const [adding, setAdding] = useState(false);
    const [addingValue, setAddingValue] = useState(null);

    useEffect(() => { load(); }, []);
    async function load() {
        try { const data = await api.get('/attributes'); setAttributes(data); }
        catch { setAttributes([]); } finally { setLoading(false); }
    }
    async function loadValues(attrId) {
        if (values[attrId]) return;
        const data = await api.get(`/attributes/${attrId}/values`);
        setValues(prev => ({ ...prev, [attrId]: data }));
    }
    function toggleExpand(attrId) {
        if (expanded === attrId) return setExpanded(null);
        setExpanded(attrId); loadValues(attrId);
    }
    async function handleCreate(e) {
        e.preventDefault(); if (!newName.trim()) return; setAdding(true);
        try { await api.post('/attributes', { name: newName.trim() }); toast.success('Attribute created'); setNewName(''); load(); }
        catch (err) { toast.error(err.message); } finally { setAdding(false); }
    }
    async function handleDelete(attrId) {
        if (!confirm('Delete this attribute and all its values?')) return;
        try { await api.delete(`/attributes/${attrId}`); setAttributes(prev => prev.filter(a => String(a._id) !== attrId)); }
        catch (err) { toast.error(err.message); }
    }
    async function handleAddValue(e, attrId) {
        e.preventDefault(); const val = (newValueInputs[attrId] ?? '').trim(); if (!val) return; setAddingValue(attrId);
        try {
            await api.post(`/attributes/${attrId}/values`, { value: val });
            toast.success('Value added'); setNewValueInputs(prev => ({ ...prev, [attrId]: '' }));
            const data = await api.get(`/attributes/${attrId}/values`);
            setValues(prev => ({ ...prev, [attrId]: data }));
        } catch (err) { toast.error(err.message); } finally { setAddingValue(null); }
    }
    async function handleDeleteValue(attrId, valueId) {
        try {
            await api.delete(`/attributes/values/${valueId}`);
            setValues(prev => ({ ...prev, [attrId]: prev[attrId].filter(v => String(v._id) !== valueId) }));
        } catch (err) { toast.error(err.message); }
    }

    if (loading) return <LoadingSpinner />;
    return (
        <div className="max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-zinc-900">Attributes</h1>
                <p className="text-zinc-500 text-sm mt-1">Global variant attributes — Color, Size, Storage, Material…</p>
            </div>
            <form onSubmit={handleCreate} className="bg-white border border-zinc-200 rounded-2xl p-5 mb-6 flex gap-2">
                <input type="text" placeholder="New attribute (e.g. Color)" value={newName}
                    onChange={e => setNewName(e.target.value)} required
                    className="flex-1 h-10 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                <Button type="submit" isLoading={adding} size="sm" className="bg-blue-600 text-white font-semibold rounded-xl px-4">
                    <FiPlus size={14} className="mr-1" /> Add
                </Button>
            </form>
            {attributes.length === 0 ? <p className="text-zinc-400 text-sm text-center py-10">No attributes yet.</p> : (
                <div className="flex flex-col gap-2">
                    {attributes.map(attr => (
                        <div key={attr._id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3">
                                <button onClick={() => toggleExpand(String(attr._id))}
                                    className="flex items-center gap-2 text-sm font-semibold text-zinc-800 hover:text-blue-600 transition">
                                    {expanded === String(attr._id) ? <FiChevronDown size={15} /> : <FiChevronRight size={15} />}
                                    {attr.name}
                                </button>
                                <button onClick={() => handleDelete(String(attr._id))}
                                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition">
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                            {expanded === String(attr._id) && (
                                <div className="border-t border-zinc-100 px-5 py-3 flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-2 mb-1">
                                        {(values[String(attr._id)] ?? []).map(v => (
                                            <span key={v._id} className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-xs font-medium px-3 py-1 rounded-full">
                                                {v.value}
                                                <button onClick={() => handleDeleteValue(String(attr._id), String(v._id))}
                                                    className="text-zinc-400 hover:text-red-500 transition">×</button>
                                            </span>
                                        ))}
                                        {!(values[String(attr._id)]?.length) && <span className="text-xs text-zinc-400">No values yet</span>}
                                    </div>
                                    <form onSubmit={e => handleAddValue(e, String(attr._id))} className="flex gap-2">
                                        <input type="text" placeholder="Add value (e.g. Red)"
                                            value={newValueInputs[String(attr._id)] ?? ''}
                                            onChange={e => setNewValueInputs(prev => ({ ...prev, [String(attr._id)]: e.target.value }))}
                                            className="flex-1 h-9 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none transition" />
                                        <Button type="submit" size="sm" variant="flat"
                                            isLoading={addingValue === String(attr._id)} className="font-semibold rounded-xl">Add</Button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AttributesPage;