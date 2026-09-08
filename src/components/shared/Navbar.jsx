'use client';

import Link from 'next/link';
import { Badge, Button, Dropdown } from '@heroui/react';
import { FiChevronDown, FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { LiaOpencart } from "react-icons/lia";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

const roleBadge = {
    admin: { label: 'Admin', className: 'bg-red-500 text-white border-red-400' },
    customer: { label: 'Customer', className: 'bg-blue-600 text-white border-blue-500' }
};

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
];

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    function handleLogout() {
        logout();
        toast.success('User Logged Out.');
        router.push('/');
    }

    const badge = roleBadge[user?.role] ?? roleBadge.customer;
    return (
        <nav className="sticky top-0 z-50 border-b border-blue-50 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm"><LiaOpencart /></span>
                    </div>
                    <span className="text-xl font-bold text-blue-900 tracking-wide">eCart</span>
                </Link>

                <ul className="hidden md:flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50/50 px-3 py-2">
                    {navLinks.map(link => (
                        <li key={link.href}>
                            <Link href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-blue-600">
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    {isAdmin && (
                        <li>
                            <Link href="/dashboard/admin" className="rounded-full px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 transition hover:bg-white dark:hover:bg-zinc-800">
                                Admin
                            </Link>
                        </li>
                    )}
                </ul>

                <div className='hidden md:flex items-center gap-4 relative'>
                    {
                        !mounted ? null :
                            user ? (
                                <>
                                    <Link href={'/cart'} className='absolute -top-2 right-3 z-10'>
                                        <Badge content={totalItems > 0 ? totalItems : null} color='danger' size='sm'>
                                            <Button isIconOnly variant='danger' size="sm">
                                                <FiShoppingCart size={20} />
                                            </Button>
                                        </Badge>
                                    </Link>

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <div className="flex items-center gap-3 cursor-pointer rounded-xl p-1.5 hover:bg-gray-50 transition-colors">
                                                <div className="relative">
                                                    {user.image
                                                        ? <img src={user?.image} alt={user?.name} className="h-9 w-9 rounded-full object-cover border-2 border-blue-100" />
                                                        : <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center"><FiUser size={16} className="text-blue-600" /></div>
                                                    }
                                                    <span className={`absolute -top-1.5 -left-8 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border-2 border-white shadow-sm ${badge.className}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="text-sm font-semibold text-gray-700 max-w-28 truncate">{user?.name}</span>
                                                    <span className="text-xs text-gray-400 max-w-28 truncate">{user?.email}</span>
                                                </div>
                                                <FiChevronDown size={14} className="text-gray-400" />
                                            </div>
                                        </Dropdown.Trigger>
                                        <Dropdown.Popover>
                                            <Dropdown.Menu aria-label="User menu">
                                                <Dropdown.Item key="dashboard" textValue="Dashboard">
                                                    <Link href="/dashboard" className="block w-full text-sm font-medium text-gray-700 hover:text-blue-600">Dashboard</Link>
                                                </Dropdown.Item>
                                                
                                                <Dropdown.Item key="logout" textValue="Logout" className="text-red-500 hover:bg-red-50 transition" variant="danger" onClick={handleLogout}>
                                                    <span className="text-sm font-medium">Log Out</span>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">Login</Link>
                                    <Link href="/auth/register">
                                        <Button className="h-11 bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-200 rounded-xl">Register</Button>
                                    </Link>
                                </>
                            )
                    }
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    {
                        mounted && user && (
                            <Link href="/cart">
                                <Badge content={totalItems > 0 ? totalItems : null} color="danger" size="sm">
                                    <Button isIconOnly variant="light" size="sm"><FiShoppingCart size={20} /></Button>
                                </Badge>
                            </Link>
                        )}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="flex items-center justify-center rounded-lg p-2 text-blue-900 hover:bg-blue-50 transition">
                        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {
                mobileOpen && (
                    <div className="border-t border-blue-50 bg-white md:hidden">
                        <div className="space-y-1 px-4 py-5">
                            {navLinks.map(link => (
                                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-slate-600 hover:bg-blue-50/50 hover:text-blue-600 transition">{link.label}</Link>
                            ))}
                            {isAdmin && <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-base font-medium text-orange-600 hover:bg-orange-50 transition">Admin Panel</Link>}
                            <div className="border-t border-blue-50 pt-4 mt-2">
                                {user ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                                            {user.image
                                                ? <img src={user.image} alt={user.name} className="h-10 w-10 rounded-full object-cover border-2 border-blue-100" />
                                                : <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"><FiUser size={18} className="text-blue-600" /></div>
                                            }
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50/50 transition">Dashboard</Link>

                                        <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full text-left rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition">Log Out</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-center text-base font-medium text-blue-600 hover:bg-blue-50/50 transition">Login</Link>
                                        <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                                            <Button className="h-11 w-full bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200">Register</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;