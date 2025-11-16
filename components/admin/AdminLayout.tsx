import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminDashboardPage from './AdminDashboardPage';
import WithdrawalsPage from './WithdrawalsPage';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('Dashboard');
    
    useEffect(() => {
        // Admin panel has a fixed light theme for the content area
        document.documentElement.classList.remove('dark');
        document.body.className = 'bg-slate-100';
    }, []);

    const renderPage = () => {
        switch(activePage) {
            case 'Dashboard':
                return <AdminDashboardPage onNavigate={setActivePage} />;
            case 'Withdrawals':
                return <WithdrawalsPage />;
            default:
                return <AdminDashboardPage onNavigate={setActivePage} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                activePage={activePage}
                setActivePage={setActivePage}
            />
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