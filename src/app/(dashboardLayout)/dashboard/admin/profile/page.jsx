'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@heroui/react';
import { FiUser, FiCamera, FiLock, FiEdit3, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from '@/components/ui/ImageUploader';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const DashboardProfilePage = () => {
    const { user, fetchUser } = useAuth();
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [profileLoading, setProfileLoading] = useState(false);

    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwLoading, setPwLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileForm({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const displayAvatar = avatarPreview ?? user?.image ?? '';

    async function handleAvatarUpload(url) {
        setAvatarPreview(url);
        try {
            await api.patch('/customers/me', { image: url });
            toast.success('Avatar updated');
            setShowAvatarUpload(false);
            if (fetchUser) fetchUser();
        }
        catch (err) {
            setAvatarPreview(null);
            toast.error(err?.response?.data?.message || err.message);
        }
    }

    async function handleProfileUpdate(e) {
        e.preventDefault();
        setProfileLoading(true);
        try {
            await api.patch('/customers/me', {
                name: profileForm.name,
                email: profileForm.email,
            });
            toast.success('Profile details updated');
            if (fetchUser) fetchUser();
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setProfileLoading(false);
        }
    }

    async function handlePasswordChange(e) {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            return toast.error('New passwords do not match');
        }
        setPwLoading(true);
        try {
            await api.patch('/customers/me', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
                confirmPassword: pwForm.confirmPassword
            });
            toast.success('Password updated');
            setPwForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
        catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
        finally { setPwLoading(false); }
    }

    const roleBadge = {
        admin: 'bg-red-100 text-red-700 border border-red-200',
        customer: 'bg-blue-100 text-blue-700 border border-blue-200'
    };

    return (
        <div className="max-w-xl flex flex-col gap-6">
            <div className="mb-2">
                <h1 className="text-2xl font-extrabold text-zinc-900">Profile</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage your account details</p>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-zinc-200 p-8 text-center shadow-sm">

                <div className="relative w-24 h-24 mx-auto mb-3">
                    {displayAvatar
                        ? <img src={displayAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow" />
                        : <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-100"><FiUser size={36} className="text-blue-400" /></div>
                    }
                    <button
                        onClick={() => setShowAvatarUpload(!showAvatarUpload)}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700 transition shadow-md"
                        title="Change Image"
                    >
                        <FiCamera size={13} />
                    </button>
                </div>

                {!showAvatarUpload && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowAvatarUpload(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                        >
                            <FiCamera size={14} />
                            Change Image
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {showAvatarUpload && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 relative bg-zinc-50 border border-zinc-200 rounded-xl p-4 overflow-hidden"
                        >
                            <button
                                onClick={() => setShowAvatarUpload(false)}
                                className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-200 transition"
                                title="Close"
                            >
                                <FiX size={18} />
                            </button>

                            <div className="flex justify-center mb-3">
                                <ImageUploader value={displayAvatar} onUpload={handleAvatarUpload} label="" />
                            </div>

                            <Button
                                size="sm"
                                variant="flat"
                                color="default"
                                onClick={() => setShowAvatarUpload(false)}
                                className="text-xs font-medium"
                            >
                                Cancel
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <h2 className="text-xl font-extrabold text-zinc-900">{user?.name}</h2>
                <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
                <span className={`inline-block mt-2 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${roleBadge[user?.role] || roleBadge.customer}`}>{user?.role}</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                className="bg-white rounded-2xl border border-zinc-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                    <FiEdit3 size={18} className="text-blue-500" /> Personal Information
                </h2>
                <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Name</label>
                        <input
                            type="text"
                            value={profileForm.name}
                            onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                            required
                            className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-zinc-700">Email Address</label>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                            required
                            className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                        />
                    </div>
                    <Button type="submit" isLoading={profileLoading} className="self-start h-11 bg-blue-600 text-white font-semibold rounded-xl px-6 hover:bg-blue-700 transition shadow-sm shadow-blue-200/50">
                        Save Changes
                    </Button>
                </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-zinc-200 p-7 shadow-sm">
                <h2 className="text-lg font-bold text-zinc-900 mb-5 flex items-center gap-2">
                    <FiLock size={18} className="text-blue-500" /> Change Password
                </h2>
                <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                    {[{ key: 'currentPassword', label: 'Current Password' }, { key: 'newPassword', label: 'New Password' }, { key: 'confirmPassword', label: 'Confirm New Password' }].map(({ key, label }) => (
                        <div key={key} className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-zinc-700">{label}</label>
                            <input type="password" value={pwForm[key]} onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))} required
                                className="h-11 px-3 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                        </div>
                    ))}
                    <Button type="submit" isLoading={pwLoading} className="self-start h-11 bg-blue-600 text-white font-semibold rounded-xl px-6 hover:bg-blue-700 transition shadow-sm shadow-blue-200/50">
                        Update Password
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}

export default DashboardProfilePage;