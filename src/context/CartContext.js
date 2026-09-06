'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user) {
            return setCart({ items: [] });
        }
        setLoading(true);
        try {
            const data = await api.get('/cart');
            setCart(data?.items ? data : { items: data || [] });
        }
        catch {
            setCart({ items: [] });
        }
        finally { setLoading(false); }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    async function addToCart(productId, quantity = 1) {
        const data = await api.post('/cart/add', {
            productId,
            quantity
        });
        setCart(data);
    }
    async function removeFromCart(productId) {
        const data = await api.delete(`/cart/remove/${productId}`);
        setCart(data);
    }
    async function clearCart() {
        await api.delete('/cart/clear');
        setCart({ items: [] });
    }

    const items = Array.isArray(cart?.items) ? cart.items : [];
    const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, clearCart, totalItems, totalPrice, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() { return useContext(CartContext); }