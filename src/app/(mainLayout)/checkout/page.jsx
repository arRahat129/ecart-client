'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Card } from '@heroui/react';
import { api } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import AddressForm from '@/components/checkout/AddressForm';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [loading, setLoading] = useState(false);
    const { cart, totalPrice, fetchCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        loadAddresses();
    }, []);

    async function loadAddresses() {
        try {
            const data = await api.get('/addresses');
            setAddresses(data);
            if (data.length > 0) {
                setSelectedAddress(data[0]._id);
            }
        }
        catch { }
    }

    async function handlePlaceOrder() {
        if (!selectedAddress) {
            return toast.error('Please select a delivery address');
        }
        setLoading(true);
        try {
            await api.post('/orders/place', { addressId: selectedAddress, paymentMethod });
            await fetchCart();
            toast.success('Order placed!');
            router.push('/dashboard/customer/orders');
        } catch (err) { toast.error(err.message); }
        finally { setLoading(false); }
    }

    return (
        <div className="max-w-4xl mx-auto w-full px-4 py-10 grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-6">
                <Card shadow="none" className="border border-zinc-200 rounded-2xl">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-lg font-bold text-zinc-900">Delivery Address</h2>
                            <Button size="sm" variant="flat" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Address'}</Button>
                        </div>
                        {
                            showForm && <div className="mb-5">
                                <AddressForm onSaved={() => { setShowForm(false); loadAddresses(); }} />
                            </div>
                        }

                        <div className="flex flex-col gap-3">
                            {addresses.map(addr => (
                                <label key={addr._id} className="flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-zinc-50 transition">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        value={addr._id}
                                        checked={selectedAddress === addr._id}
                                        onChange={(e) => setSelectedAddress(e.target.value)}
                                        className="w-4 h-4 mt-1 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                                    />
                                    <div className="text-sm">
                                        <span className="font-semibold text-zinc-900">{addr.label}</span>
                                        <p className="text-zinc-500 mt-0.5">{addr.street}, {addr.city}, {addr.country}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {addresses.length === 0 && !showForm && <p className="text-zinc-400 text-sm">No addresses yet. Add one above.</p>}
                    </div>
                </Card>
                <Card shadow="none" className="border border-zinc-200 rounded-2xl">
                    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-zinc-900 mb-4">Payment Method</h2>

                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-zinc-50 transition">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                                />
                                <span className="font-semibold text-zinc-800 text-sm">Cash on Delivery</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-zinc-200 hover:border-blue-400 hover:bg-zinc-50 transition">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={paymentMethod === 'Online'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                                />
                                <span className="font-semibold text-zinc-800 text-sm">Online Payment</span>
                            </label>
                        </div>
                    </div>
                </Card>
            </div>
            <div>
                <Card shadow="none" className="border border-zinc-200 rounded-2xl sticky top-24">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-zinc-900 mb-4">Order Summary</h2>
                        <div className="flex flex-col gap-1.5 mb-4">
                            {cart.items.map(item => (
                                <div key={item.productId} className="flex justify-between text-sm">
                                    <span className="text-zinc-600 truncate mr-2">{item.name} ×{item.quantity}</span>
                                    <span className="font-semibold text-zinc-800 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-zinc-100 pt-3 flex justify-between font-bold text-zinc-900 mb-5">
                            <span>Total</span><span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Button className="w-full h-12 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-200/50" isLoading={loading} onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CheckoutPage;