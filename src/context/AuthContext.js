'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';

const TOKEN_KEY = 'ecart_token';

const saveToken = (t) => localStorage.setItem(TOKEN_KEY, t);

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null);

const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const parseToken = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            role: payload.role,
            image: payload.image,
        };
    } catch {
        return null;
    }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => parseToken(getToken()));
    const [loading, setLoading] = useState(() => {
        const token = getToken();
        return Boolean(token && parseToken(token));
    });

    useEffect(() => {
        const token = getToken();
        if (!token || !parseToken(token)) {
            if (token) removeToken();
            return;
        }

        api.get('/customers/me')
            .then(profile => setUser(prev => ({ ...prev, ...profile, id: profile._id })))
            .catch(() => {
                removeToken();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const data = await api.post('/auth/login', { email, password });
        saveToken(data.token);
        setUser({
            id: data.customer.id,
            name: data.customer.name,
            email: data.customer.email,
            role: data.customer.role,
            image: data.customer.image,
        });

        return data;
    }

    async function register(name, email, password, image) {
        return api.post('/auth/register', { name, email, password, image });
    }

    function logout() {
        removeToken();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}