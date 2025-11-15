import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboardPage from './AdminDashboardPage';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    useEffect(() => {
        // Admin panel has a fixed light theme for the content area
        document.documentElement.classList.remove('dark');
        document.body.className = 'bg-slate-100';
    }, []);

    // Placeholder for future routing within the admin panel
    const renderPage = () => {
        return <AdminDashboardPage />;
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
