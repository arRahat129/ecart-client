'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { LiaOpencart } from 'react-icons/lia';

const Sidebar = ({ links, mobileOpen, onClose }) => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const router = useRouter();

    function handleLogout() {
        logout();
        toast.success('Logged out');
        router.push('/');
    }

    const grouped = links.reduce((acc, link) => {
        const key = link.group ?? '';
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(link);
        return acc;
    }, {});

    const baseHref = links[0]?.href ?? '/dashboard';

    const inner = (
        <div className="flex flex-col h-full">

            <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800 shrink-0">
                <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">
                            <LiaOpencart />
                        </span>
                    </div>
                    <span className="text-lg font-bold text-white tracking-wide">eCart</span>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white transition p-1">
                        <FiX size={20} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {Object.entries(grouped).map(([group, items]) => (
                    <div key={group} className="mb-3">
                        {group && <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 px-3 pb-1">{group}</p>}
                        {items.map(link => {
                            const Icon = link.icon;
                            const active = pathname === link.href || (link.href !== baseHref && pathname.startsWith(link.href));
                            return (
                                <Link key={link.href} href={link.href} onClick={onClose}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                                    <Icon size={16} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="border-t border-zinc-800 p-4 shrink-0">
                <div className="flex items-center gap-3 mb-3">
                    {user?.image
                        ? <img src={user.image} alt={user.name} className="h-9 w-9 rounded-full object-cover border-2 border-zinc-700 shrink-0" />
                        : <div className="h-9 w-9 rounded-full bg-zinc-700 flex items-center justify-center shrink-0"><FiUser size={16} className="text-zinc-400" /></div>
                    }
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition">
                    <FiLogOut size={15} /> Log Out
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden md:flex w-60 shrink-0 bg-zinc-900 border-r border-zinc-800 flex-col h-screen sticky top-0">
                {inner}
            </aside>
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
                    <aside className="fixed left-0 top-0 bottom-0 w-72 bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col md:hidden">
                        {inner}
                    </aside>
                </>
            )}
        </>
    );
};

export default Sidebar;