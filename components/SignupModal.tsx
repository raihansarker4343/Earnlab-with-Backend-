import React, { useState, useEffect } from 'react';

interface SignupModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialEmail: string;
    onSignupSuccess: () => void;
    onSwitchToSignin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, initialEmail, onSignupSuccess, onSwitchToSignin }) => {
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showReferralInput, setShowReferralInput] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
        }
    }, [isOpen]);

    useEffect(() => {
        setEmail(initialEmail);
        // Reset state on open
        setShowReferralInput(false);
        setPassword('');
        setReferralCode('');
    }, [initialEmail, isOpen]);


    const handleTransitionEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically have more complex validation and an API call
        if (password.length < 6) { 
            alert('Password must be at least 6 characters long.');
            return;
        }
        console.log(`Registering user: ${email} with password: ${password} and referral: ${referralCode}`);
        onSignupSuccess();
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
                    <h2 className="text-3xl font-bold">Don't leave without your gift!</h2>
                     <p className="text-slate-300 mt-2">
                        Sign up now and receive <span className="font-bold text-[#22c55e]">$5.00</span> as a sign up bonus! ✨
                    </p>
                    <button 
                        onClick={onClose} 
                        className="absolute -top-4 -right-4 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    <button onClick={onSignupSuccess} className="w-full bg-[#1877F2] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-colors">
                        <i className="fab fa-facebook-f text-lg"></i> Sign Up with Facebook
                    </button>
                    <button onClick={onSignupSuccess} className="w-full bg-black text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors border border-slate-600">
                        <i className="fab fa-apple text-xl"></i> Sign up with Apple
                    </button>
                </div>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-slate-600" />
                    <span className="mx-4 text-slate-400 text-sm font-semibold">OR</span>
                    <hr className="flex-grow border-slate-600" />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="modal-email" className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                type="email" 
                                id="modal-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Type here..."
                                required
                                className="w-full bg-[#334155] text-white p-3 pl-12 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="modal-password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                         <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id="modal-password"
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

                    {showReferralInput ? (
                        <div>
                            <div className="relative">
                                <input 
                                    type="text"
                                    id="modal-referral"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                    placeholder="Referral Code"
                                    className="w-full bg-[#334155] text-white p-3 px-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-slate-400"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">(Optional)</span>
                            </div>
                        </div>
                    ) : (
                        <button type="button" onClick={() => setShowReferralInput(true)} className="text-sm text-slate-400 hover:underline text-center block w-full pt-1">
                            I have a referral code
                        </button>
                    )}
                    
                    <p className="text-xs text-slate-400 text-center !mt-6">
                        By signing up you agree to the <a href="#" className="text-green-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-green-400 hover:underline">Terms of Service</a>
                    </p>

                    <button 
                        type="submit"
                        className="w-full bg-[#22c55e] hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors !mt-6"
                    >
                        Sign Up
                    </button>

                    <p className="text-sm text-slate-400 text-center !mt-4">
                        Got an account? <button type="button" onClick={onSwitchToSignin} className="text-green-400 hover:underline font-semibold">Log in</button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;