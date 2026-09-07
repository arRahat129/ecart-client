'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardRedirect() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/auth/login');
            }
            else if (isAdmin) {
                router.replace('/dashboard/admin');
            }
            else {
                router.replace('/dashboard/customer');
            }
        }
    }, [user, loading, isAdmin, router]);

    return (
        <LoadingSpinner fullPage />
    );
}