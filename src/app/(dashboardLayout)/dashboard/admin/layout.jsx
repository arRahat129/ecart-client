'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { LiaOpencart } from 'react-icons/lia';
import { adminLinks } from '@/components/dashboard/sidebarLinks';

const AdminDashboardLayout = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/auth/login');
            }
            else if (!isAdmin) {
                router.replace('/dashboard/customer');
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading) return <LoadingSpinner fullPage />;
    if (!user || !isAdmin) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-50">
            <Sidebar links={adminLinks} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 overflow-auto">
                <header className="md:hidden flex items-center gap-3 px-4 py-4 bg-white border-b border-zinc-200 sticky top-0 z-30">
                    <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 transition">
                        <FiMenu size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-black text-xs">
                                <LiaOpencart />
                            </span>
                        </div>
                        <span className="font-bold text-blue-900 text-base">eCart — Admin</span>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8">{children}</main>
            </div>
        </div>
    );
};

export default AdminDashboardLayout;