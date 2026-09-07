import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const MainLayout = ({ children }) => {
    return (
        <div>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;