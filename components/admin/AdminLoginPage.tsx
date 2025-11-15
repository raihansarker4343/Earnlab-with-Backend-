import React, { useState } from 'react';

interface AdminLoginPageProps {
    onLoginSuccess: () => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Simple validation for demo purposes.
            if (email && password) {
                // In a real app, you'd verify credentials against a server.
                // For now, any input is considered a success.
                onLoginSuccess();
            } else {
                setError('Please enter both email and password.');
            }
            setIsLoading(false);
        }, 500);
    };
    
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-8">
                <div>
                    <h2 className="text-3xl font-bold text-center text-slate-900">Admin Panel</h2>
                    <p className="text-center text-slate-500 mt-2">Sign in to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:bg-slate-500 disabled:cursor-wait"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
                &copy; {new Date().getFullYear()} EarnLab. All rights reserved.
            </p>
        </div>
    );
};

export default AdminLoginPage;