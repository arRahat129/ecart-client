'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import ProductCard from '@/components/products/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useRouter, useSearchParams } from 'next/navigation';

const CATEGORIES = ['All', 'Electronics', 'Footwear', 'Kitchen', 'Accessories', 'Books', 'Home', 'Other'];


function ProductsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
    const [activeCategory, setActiveCategory] = useState(() => {
        const cat = searchParams.get('category');
        return cat && CATEGORIES.includes(cat) ? cat : 'All';
    });

    useEffect(() => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (activeCategory !== 'All') params.set('category', activeCategory);
        const qs = params.toString();
        router.replace(qs ? `/products?${qs}` : '/products', { scroll: false });
    }, [search, activeCategory, router]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ status: 'approved' });
            if (search) params.set('search', search);
            if (activeCategory !== 'All') params.set('category', activeCategory);
            const data = await api.get(`/products?${params}`);
            setProducts(data.products ?? []);
        } catch { setProducts([]); }
        finally { setLoading(false); }
    }, [search, activeCategory]);

    useEffect(() => {
        const t = setTimeout(fetchProducts, 350);
        return () => clearTimeout(t);
    }, [fetchProducts]);

    return (
        <div className="max-w-7xl mx-auto w-full px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-zinc-900 mb-1">All Products</h1>
                <p className="text-zinc-500 text-sm">Browse our full catalog</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative max-w-sm w-full">
                    <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 text-sm rounded-xl border border-zinc-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition" />
                </div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200/50' : 'bg-white text-zinc-600 border-zinc-200 hover:border-blue-400 hover:text-blue-600'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? <LoadingSpinner /> : products.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-4xl mb-4">🔍</p>
                    <p className="text-zinc-500 text-lg font-medium">No products found</p>
                    <p className="text-zinc-400 text-sm mt-1">Try a different search or category.</p>
                </div>
            ) : (
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.04 } }, hidden: {} }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                    {products.map(p => (
                        <motion.div key={p._id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}>
                            <ProductCard product={p} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

const ProductsPage = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ProductsContent />
        </Suspense>
    );
}

export default ProductsPage;