import React from "react";

interface BlockedWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlockedWithdrawModal: React.FC<BlockedWithdrawModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      {/* Background click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-[90%] max-w-md">
        <div
          className="
            bg-[#020617]/95 
            dark:bg-[#020617]/95
            border border-red-500/40 
            rounded-2xl 
            shadow-[0_0_35px_rgba(248,113,113,0.35)]
            px-6 py-7
            text-center
            animate-[scaleIn_0.18s_ease-out]
          "
        >
          {/* Danger Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-red-400 to-orange-400 flex items-center justify-center shadow-lg">
                <i className="fas fa-ban text-white text-3xl" />
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-red-200/40 animate-ping opacity-40" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-red-400 tracking-wide mb-2">
            Withdrawals Restricted
          </h2>

          {/* Message */}
          <p className="text-sm sm:text-base text-slate-300/90 mb-5 leading-relaxed">
            Your account is restricted from withdrawals.
            <br />
            Please contact support for assistance.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5 
                rounded-lg 
                text-sm font-semibold 
                bg-slate-800 
                hover:bg-slate-700 
                text-slate-100 
                border border-slate-600/60
                transition-colors
              "
            >
              Close
            </button>

            <button
              onClick={onClose}
              className="
                px-4 py-2.5 
                rounded-lg 
                text-sm font-semibold 
                bg-red-500 
                hover:bg-red-600 
                text-white 
                shadow-md 
                shadow-red-500/40
                flex items-center justify-center gap-2
              "
            >
              <i className="fas fa-headset text-xs" />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default BlockedWithdrawModal;
