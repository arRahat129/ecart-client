'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const DashboardLayout = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading && !user) {
            router.replace('/auth/login');
        }
    }, [user, loading, router, mounted]);

    if (!mounted || loading) {
        return <LoadingSpinner fullPage />;
    }
    if (!user) {
        return null;
    }

    return (
        <>
            {children}
        </>
    );
};

export default DashboardLayout;