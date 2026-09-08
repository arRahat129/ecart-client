'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@heroui/react';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item }) => {
    const { removeFromCart } = useCart();
    async function handleRemove() {
        try {
            await removeFromCart(item.productId);
            toast.success('Item removed');
        }
        catch (err) { toast.error(err.message); }
    }
    return (
        <div className="flex items-center gap-4 py-4 border-b border-zinc-100 last:border-0">
            <img src={item.image || 'https://placehold.co/64x64/f1f5f9/94a3b8?text=?'} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-zinc-100 shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-800 truncate">{item.name}</p>
                <p className="text-sm text-zinc-500 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
                <p className="font-bold text-zinc-800">${(item.price * item.quantity).toFixed(2)}</p>
                <Button isIconOnly size="sm" variant="light" color="danger" onPress={handleRemove}><FiTrash2 size={15} /></Button>
            </div>
        </div>
    );
};

export default CartItem;