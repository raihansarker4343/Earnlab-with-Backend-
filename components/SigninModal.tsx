import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';

interface SigninModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToSignup: () => void;
}

const SigninModal: React.FC<SigninModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
    const { setIsLoggedIn } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        }
    }, [isOpen]);

    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleLoginSuccess = () => {
        // In a real app, this would be an API call
        // For demo, just log in
        setIsLoggedIn(true);
        onClose();
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

                <div className="space-y-3 mb-6">
                    <button onClick={handleLoginSuccess} className="w-full bg-white text-slate-800 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" /> Sign in with Google
                    </button>
                    <button onClick={handleLoginSuccess} className="w-full bg-[#1877F2] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors">
                        <i className="fab fa-facebook-f text-lg"></i> Sign In with Facebook
                    </button>
                    <button onClick={handleLoginSuccess} className="w-full bg-black text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors border border-slate-600">
                        <i className="fab fa-apple text-xl"></i> Sign In with Apple
                    </button>
                    <button onClick={handleLoginSuccess} className="w-full bg-[#1b2838] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-[#2a475e] transition-colors border border-slate-600">
                        <i className="fab fa-steam-symbol text-xl"></i> Sign In with Steam
                    </button>
                </div>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-slate-600" />
                    <span className="mx-4 text-slate-400 text-sm font-semibold">OR</span>
                    <hr className="flex-grow border-slate-600" />
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); handleLoginSuccess(); }} className="space-y-4">
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
                    
                    <a href="#" className="text-sm text-green-400 hover:underline text-right block w-full pt-1">
                        Forgot your password?
                    </a>

                    <button 
                        type="submit"
                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors !mt-6"
                    >
                        Sign In
                    </button>
                    
                    <p className="text-sm text-slate-400 text-center !mt-6">
                        No account? <button type="button" onClick={onSwitchToSignup} className="text-green-400 hover:underline font-semibold">Sign up</button>
                    </p>

                    <p className="text-xs text-slate-500 text-center !mt-6">
                        By signing in, you are agreeing to our <a href="#" className="text-green-400 hover:underline">Terms of Service</a> and <a href="#" className="text-green-400 hover:underline">Privacy Policy</a>. General prohibited users using multiple accounts, completing offers on another user's account, or using any type of VPN, VPS or Emulator software.
                    </p>

                </form>
            </div>
        </div>
    );
};

export default SigninModal;
