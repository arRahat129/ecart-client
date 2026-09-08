'use client';
import { React, useState, useEffect } from 'react';
import { Button, Chip } from '@heroui/react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminCustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    useEffect(() => {
        load();
    }, []);
    async function load() {
        try {
            const data = await api.get('/customers');
            setCustomers(data.customers);
        }
        catch { }
        finally { setLoading(false); }
    }
    async function toggleRole(c) {
        const newRole = c.role === 'admin' ? 'customer' : 'admin';
        try {
            await api.patch(`/customers/${c._id}/role`, {
                role: newRole
            });
            toast.success(`${c.name} is now ${newRole}`);
            load();
        }
        catch (err) { toast.error(err.message); }
    }
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900">Customers</h1>
                <p className="text-gray-500 text-sm mt-1">Manage roles</p>
            </div>
            <div className="flex flex-col gap-2">
                {customers.map(c => (
                    <div key={c._id} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center justify-between gap-4 hover:shadow-sm transition">
                        <div>
                            <p className="font-semibold text-gray-800">{c.name}</p>
                            <p className="text-sm text-gray-500">{c.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Chip color={c.role === 'admin' ? 'danger' : 'default'} size="sm" className="font-semibold capitalize">{c.role}</Chip>
                            {c._id !== user?.id && (
                                <Button size="sm" variant={c.role === 'admin' ? 'outline' : 'danger'} onPress={() => toggleRole(c)} className="font-semibold rounded-xl">
                                    {c.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminCustomersPage;