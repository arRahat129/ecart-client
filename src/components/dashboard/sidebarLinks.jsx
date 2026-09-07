import React from 'react';
import { FiGrid, FiList, FiPackage, FiPlusSquare, FiShoppingBag, FiUser, FiUsers } from 'react-icons/fi';

const sidebarLinks = [
    { href: '/dashboard', label: 'Overview', icon: FiGrid, roles: ['admin', 'customer'] },

    { href: '/dashboard/admin/products', label: 'Product Approvals', icon: FiPackage, roles: ['admin'], group: 'Admin' },
    { href: '/dashboard/admin/orders', label: 'All Orders', icon: FiShoppingBag, roles: ['admin'], group: 'Admin' },
    { href: '/dashboard/admin/customers', label: 'Customers', icon: FiUsers, roles: ['admin'], group: 'Admin' },

    { href: '/dashboard/submit-product', label: 'Submit Product', icon: FiPlusSquare, roles: ['customer'], group: 'Seller' },
    { href: '/dashboard/my-products', label: 'My Submissions', icon: FiList, roles: ['customer'], group: 'Seller' },
    { href: '/dashboard/orders', label: 'My Orders', icon: FiShoppingBag, roles: ['customer'], group: 'Buyer' },

    { href: '/dashboard/profile', label: 'Profile', icon: FiUser, roles: ['admin', 'customer'], group: 'Account' },
];

export default sidebarLinks;