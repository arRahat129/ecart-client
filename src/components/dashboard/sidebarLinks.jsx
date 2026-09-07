import {
    FiGrid, FiPackage, FiShoppingBag, FiUsers,
    FiPlusSquare, FiList, FiUser, FiTrendingUp
} from 'react-icons/fi';

// Admin sidebar links
export const adminLinks = [
    { href: '/dashboard/admin', label: 'Overview', icon: FiGrid },
    { href: '/dashboard/admin/products', label: 'Product Approvals', icon: FiPackage, group: 'Catalog' },
    { href: '/dashboard/admin/orders', label: 'All Orders', icon: FiShoppingBag, group: 'Catalog' },
    { href: '/dashboard/admin/customers', label: 'Customers', icon: FiUsers, group: 'Catalog' },
    { href: '/dashboard/admin/profile', label: 'Profile', icon: FiUser, group: 'Account' },
];

// Customer sidebar links
export const customerLinks = [
    { href: '/dashboard/customer', label: 'Overview', icon: FiGrid },
    { href: '/dashboard/customer/add-product', label: 'Add Product', icon: FiPlusSquare, group: 'Seller' },
    { href: '/dashboard/customer/my-products', label: 'My Products', icon: FiList, group: 'Seller' },
    { href: '/dashboard/customer/product-orders', label: 'Product Orders', icon: FiTrendingUp, group: 'Seller' },
    { href: '/dashboard/customer/orders', label: 'My Orders', icon: FiShoppingBag, group: 'Buyer' },
    { href: '/dashboard/customer/profile', label: 'Profile', icon: FiUser, group: 'Account' },
];