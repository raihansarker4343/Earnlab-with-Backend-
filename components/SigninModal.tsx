import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { API_URL } from '../constants';

interface SigninModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void;
    onForgotPassword: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({ isOpen, onClose, onSwitchToSignup, onForgotPassword }) => {
    const { handleLogin } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setError(''); // Reset error on open
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                handleLogin(data.token);
            } else {
                const errorMessage = data.message || 'Failed to sign in.';
                if (errorMessage.includes('Verification failed')) {
                    setError('Connection verification failed. This can happen if you are using a VPN/proxy, or due to a temporary network issue. Please disable any VPN/proxy and try again in a few moments.');
                } else if (errorMessage.includes('VPN/Proxy')) {
                    setError('Access using a VPN/Proxy is not permitted. Please disable it and try again.');
                } else {
                    setError(errorMessage);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isRendered) {
        return null;
    }

    return (
        <div 
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={onClose}
            onTransitionEnd={handleTransitionEnd}
            aria-modal="true"
            role="dialog"
        >
            <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm"></div>
            <div 
                className={`bg-gradient-to-br from-[#052e25] via-[#102a3a] to-[#1e293b] text-white p-8 rounded-xl shadow-2xl border border-slate-700 max-w-sm w-full m-4 transform transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="relative text-center mb-6">
                    <h2 className="text-3xl font-bold">Sign In</h2>
                    <button 
                        onClick={onClose} 
                        className="absolute -top-4 -right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-200 p-4 text-sm flex items-start gap-3" role="alert">
                            <i className="fas fa-exclamation-circle flex-shrink-0 text-red-400 mt-0.5"></i>
                            <span className="text-left">{error}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="modal-signin-email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                type="email" 
                                id="modal-signin-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type here..."
                                required
                                className="w-full bg-[#334155] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="modal-signin-password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                         <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id="modal-signin-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Type here..."
                                required
                                className="w-full bg-[#334155] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-green-400 hover:underline text-right block w-full pt-1 text-left"
                    >
                        Forgot your password?
                    </button>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors !mt-6 disabled:bg-slate-500 disabled:cursor-wait"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    
                    <p className="text-sm text-slate-400 text-center !mt-6">
                        No account? <button type="button" onClick={onSwitchToSignup} className="text-green-400 hover:underline font-semibold">Sign up</button>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default SigninModal;
