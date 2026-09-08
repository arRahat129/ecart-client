'use client';
import { useState, useEffect } from 'react';
import { Chip, Button } from '@heroui/react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { FiPlusSquare, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';

const STATUS_COLOR = { pending: 'warning', approved: 'success', rejected: 'danger' };
const STATUS_LABEL = { pending: 'Under Review', approved: 'Approved — Live', rejected: 'Rejected' };

const MyProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products?sellerId=${user?.id ?? user?._id}&limit=50`)
      .then(data => setProducts(data.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900">My Submissions</h1>
          <p className="text-zinc-500 text-sm mt-1">Track the status of your submitted products</p>
        </div>
        <Link href="/dashboard/customer/add-product">
          <Button className="h-10 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
            <FiPlusSquare size={15} /> Add New
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage size={48} className="mx-auto text-zinc-300 mb-4" />
          <p className="text-zinc-500 text-lg font-medium">No Products yet</p>
          <p className="text-zinc-400 text-sm mt-1 mb-6">Add your first product for review.</p>
          <Link href="/dashboard/customer/add-product">
            <Button className="h-10 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Add a Product</Button>
          </Link>
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }} className="flex flex-col gap-3">
          {products.map(product => (
            <motion.div key={product._id}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
              className="bg-white rounded-2xl border border-zinc-200 p-4 flex items-center gap-4 hover:shadow-sm transition">
              <img src={product.image || 'https://placehold.co/64x64/f1f5f9/94a3b8?text=?'} alt={product.name}
                className="w-16 h-16 rounded-xl object-cover border border-zinc-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-800 truncate">{product.name}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{product.category} · ${parseFloat(product.price).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Link href={`/dashboard/customer/my-products/${product._id}/edit`}>
                  <Button size="sm" variant="flat" className="font-semibold rounded-xl">Edit</Button>
                </Link>
                <Chip size="sm" color={STATUS_COLOR[product.status] ?? 'default'} className="font-semibold text-xs capitalize">
                  {STATUS_LABEL[product.status] ?? product.status}
                </Chip>
                {product.status === 'rejected' && <p className="text-xs text-red-500">Contact admin for details</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default MyProductsPage;