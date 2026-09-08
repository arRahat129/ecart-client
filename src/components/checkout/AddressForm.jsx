'use client';
import { useState } from 'react';
import { Button } from '@heroui/react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const FIELDS = [
    { key: 'label', label: 'Label (e.g. Home)', span: false },
    { key: 'street', label: 'Street Address', span: true },
    { key: 'city', label: 'City', span: false },
    { key: 'state', label: 'State / Province', span: false },
    { key: 'zip', label: 'ZIP / Postal Code', span: false },
    { key: 'country', label: 'Country', span: false },
    { key: 'phone', label: 'Phone', span: false },
];

export default function AddressForm({ onSaved }) {
    const [form, setForm] = useState({ label: '', street: '', city: '', state: '', zip: '', country: '', phone: '' });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/addresses', form);
            toast.success('Address saved');
            onSaved?.();
        }
        catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            {
                FIELDS.map(f => (
                    <div key={f.key} className={`flex flex-col gap-1 ${f.span ? 'col-span-2' : ''}`}>
                        <label className="text-xs font-medium text-zinc-600">{f.label}</label>
                        <input type="text" placeholder={f.label} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required className="h-10 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                    </div>
                ))
            }
            <Button type="submit" color="primary" isLoading={loading} className="col-span-2 h-11 font-semibold rounded-xl">Save Address</Button>
        </form>
    );
}