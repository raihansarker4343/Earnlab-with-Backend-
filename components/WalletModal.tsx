import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { API_URL } from '../constants';
import type { Transaction, PaymentMethod } from '../types';
import SkeletonLoader from './SkeletonLoader';
import StatusBadge from './StatusBadge';
import BlockedWithdrawModal from './BlockedWithdrawModal';

const WithdrawalConfirmation: React.FC<{
  details: { cryptoName: string; address: string; amount: string };
  onConfirm: () => void;
  onBack: () => void;
}> = ({ details, onConfirm, onBack }) => {
  const amount = parseFloat(details.amount) || 0;
  const fee = amount * 0;
  const totalDeducted = amount + fee;

  return (
    <div className="text-slate-700 dark:text-slate-300">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
        Confirm Your Withdrawal
      </h2>
      <div className="bg-slate-100 dark:bg-[#1e293b] p-4 rounded-lg space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Amount</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ${amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">
            Network Fee
          </span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ${fee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-base font-bold border-t border-slate-200 dark:border-slate-700 pt-3">
          <span className="text-slate-900 dark:text-white">
            Total Deducted
          </span>
          <span className="text-red-500 dark:text-red-400">
            ${totalDeducted.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          You are withdrawing to the following address:
        </p>
        <p className="font-mono bg-slate-100 dark:bg-[#1e293b] p-2 rounded break-all text-xs">
          {details.address}
        </p>
        <p className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold mt-2">
          Please double-check the address. Crypto transactions are
          irreversible.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex-1 p-3 bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg font-semibold"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg"
        >
          Confirm & Withdraw
        </button>
      </div>
    </div>
  );
};

const WithdrawalForm: React.FC<{
  cryptoName: string;
  onBack: () => void;
  onProceed: (address: string, amount: string) => void;
}> = ({ cryptoName, onBack, onProceed }) => {
  const { balance } = useContext(AppContext);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('0');

  const handleCreateWithdrawal = () => {
    const withdrawalAmount = parseFloat(amount);
    if (!address.trim()) {
      alert('Please enter a wallet address.');
      return;
    }
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (withdrawalAmount > balance) {
      alert('Insufficient funds.');
      return;
    }
    onProceed(address, amount);
  };

  return (
    <div className="text-slate-700 dark:text-slate-300">
      <h2 className="text-sm font-semibold mb-6">
        <span className="text-slate-500 dark:text-slate-400">Crypto</span> &gt;{' '}
        {cryptoName}
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="chain"
            className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2"
          >
            Chain
          </label>
          <div className="relative">
            <select
              id="chain"
              className="w-full bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={cryptoName}
            >
              <option>{cryptoName}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="wallet-address"
            className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2"
          >
            Wallet Address
          </label>
          <div className="relative">
            <input
              type="text"
              id="wallet-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your Wallet Address..."
              className="w-full bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-sky-500 text-white rounded-r-lg hover:bg-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2-2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2"
          >
            Amount
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-100 dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg pl-4 pr-32 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setAmount(balance.toFixed(2))}
              className="absolute right-2 bg-sky-500 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-sky-600 text-sm"
            >
              Max Amount
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-3 bg-slate-200 dark:bg-[#1e293b] hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg"
        >
          <i className="fas fa-undo"></i>
        </button>
        <button
          onClick={handleCreateWithdrawal}
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg"
        >
          Create Withdrawal
        </button>
      </div>
    </div>
  );
};

const TransactionHistory: React.FC = () => {
  const { transactions } = useContext(AppContext);

  return (
    <div className="overflow-x-auto">
      {transactions.length > 0 ? (
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-100 dark:bg-[#1e293b]">
            <tr>
              <th scope="col" className="px-4 py-3">
                ID
              </th>
              <th scope="col" className="px-4 py-3">
                Type
              </th>
              <th scope="col" className="px-4 py-3">
                Method
              </th>
              <th scope="col" className="px-4 py-3">
                Amount
              </th>
              <th scope="col" className="px-4 py-3">
                Status
              </th>
              <th scope="col" className="px-4 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-slate-200 dark:border-slate-800 last:border-b-0"
              >
                <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        tx.type === 'Withdrawal'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-green-500/20 text-green-500'
                      }`}
                    >
                      <i
                        className={`fas ${
                          tx.type === 'Withdrawal'
                            ? 'fa-arrow-up'
                            : 'fa-arrow-down'
                        }`}
                      ></i>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {tx.type}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{tx.method}</td>
                <td
                  className={`px-4 py-3 font-semibold whitespace-nowrap ${
                    tx.type === 'Withdrawal'
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}
                >
                  ${(Number(tx.amount) || 0).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-12">
          <i className="fas fa-file-invoice-dollar text-4xl text-slate-400 dark:text-slate-500 mb-4"></i>
          <p className="text-slate-500 dark:text-slate-400">
            No transaction history found.
          </p>
        </div>
      )}
    </div>
  );
};

const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    setIsWalletModalOpen,
    balance,
    setBalance,
    setTransactions,
    setIsWithdrawSuccessModalOpen,
    user,
  } = useContext(AppContext);

  // banned কিনা চেক
  const isBanned =
    user && ((user as any).isBanned || (user as any).is_banned);

  const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>(
    'withdraw'
  );
  const [withdrawalStep, setWithdrawalStep] = useState<
    'select' | 'form' | 'confirm'
  >('select');
  const [withdrawalDetails, setWithdrawalDetails] = useState({
    cryptoName: '',
    address: '',
    amount: '0',
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoadingMethods, setIsLoadingMethods] = useState(true);
  const [errorMethods, setErrorMethods] = useState<string | null>(null);

  const [showBlockedModal, setShowBlockedModal] = useState(false);

  useEffect(() => {
    if (isWalletModalOpen) {
      const fetchMethods = async () => {
        setIsLoadingMethods(true);
        setErrorMethods(null);
        try {
          const response = await fetch(`${API_URL}/api/payment-methods`);
          if (!response.ok) {
            throw new Error('Failed to load withdrawal options.');
          }
          const data: PaymentMethod[] = await response.json();
          setPaymentMethods(data);
        } catch (error: any) {
          setErrorMethods(error.message);
        } finally {
          setIsLoadingMethods(false);
        }
      };
      fetchMethods();
    }
  }, [isWalletModalOpen]);

  const closeModal = () => {
    setIsWalletModalOpen(false);
    setTimeout(() => {
      setActiveTab('withdraw');
      setWithdrawalStep('select');
    }, 300);
  };

  const handleSelectCrypto = (cryptoName: string) => {
    if (isBanned) {
      setShowBlockedModal(true);
      return;
    }
    setWithdrawalDetails((prev) => ({ ...prev, cryptoName }));
    setWithdrawalStep('form');
  };

  const handleProceedToConfirm = (address: string, amount: string) => {
    setWithdrawalDetails((prev) => ({ ...prev, address, amount }));
    setWithdrawalStep('confirm');
  };

  const handleConfirmWithdrawal = async () => {
    if (isBanned) {
      setShowBlockedModal(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in.');
      return;
    }

    const withdrawalAmount = parseFloat(withdrawalDetails.amount);

    if (withdrawalAmount > balance) {
      alert('Insufficient funds.');
      return;
    }

    const newTransactionPayload = {
      id: `WDR${Date.now()}`,
      type: 'Withdrawal',
      method: withdrawalDetails.cryptoName,
      amount: withdrawalAmount,
      status: 'Pending',
    };

    try {
      const response = await fetch(`${API_URL}/api/transactions/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTransactionPayload),
      });

      // যদি ব্যাকএন্ড থেকে withdraw-ban 403 আসে
      if (response.status === 403) {
        setShowBlockedModal(true);
        const errorData = await response.json().catch(() => null);
        console.error('Withdraw blocked:', errorData);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData && errorData.message) || 'Failed to submit withdrawal.'
        );
      }

      const savedTransaction: Transaction = await response.json();

      const parsedTransaction = {
        ...savedTransaction,
        amount: Number(savedTransaction.amount),
      };

      setTransactions((prev) => [parsedTransaction, ...prev]);
      setBalance((prev) => prev - withdrawalAmount);

      closeModal();
      setIsWithdrawSuccessModalOpen(true);
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      alert(`Error: ${error.message}`);
    }
  };

  if (!isWalletModalOpen) return null;

  const renderWithdrawContent = () => {
    switch (withdrawalStep) {
      case 'confirm':
        return (
          <WithdrawalConfirmation
            details={withdrawalDetails}
            onConfirm={handleConfirmWithdrawal}
            onBack={() => setWithdrawalStep('form')}
          />
        );
      case 'form':
        return (
          <WithdrawalForm
            cryptoName={withdrawalDetails.cryptoName}
            onBack={() => setWithdrawalStep('select')}
            onProceed={handleProceedToConfirm}
          />
        );
      case 'select':
      default:
        if (isLoadingMethods) {
          return (
            <div className="space-y-4 p-4">
              <SkeletonLoader className="h-10 w-1/3" />
              <SkeletonLoader className="h-16 w-full" />
              <SkeletonLoader className="h-10 w-1/3 mt-4" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonLoader key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          );
        }
        if (errorMethods) {
          return (
            <p className="text-center text-red-500 p-8">{errorMethods}</p>
          );
        }

        const groupedMethods = paymentMethods.reduce((acc, method) => {
          acc[method.type] = [...(acc[method.type] || []), method];
          return acc;
        }, {} as { [key: string]: PaymentMethod[] });

        return (
          <div className="space-y-6">
            {groupedMethods.special && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Special
                </h3>
                {groupedMethods.special.map((method) => (
                  <button
                    key={method.id}
                    className="w-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      {method.iconClass.startsWith('http') ? (
                        <img
                          src={method.iconClass}
                          alt={method.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <i
                          className={`${method.iconClass} text-green-400 text-xl`}
                        ></i>
                      )}
                      <span className="font-semibold">{method.name}</span>
                    </div>
                    {method.specialBonus && (
                      <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">
                        {method.specialBonus}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {groupedMethods.cash && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Cash
                </h3>
                {groupedMethods.cash.map((method) => (
                  <button
                    key={method.id}
                    className="w-full bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-lg flex items-center gap-3"
                  >
                    {method.iconClass.startsWith('http') ? (
                      <img
                        src={method.iconClass}
                        alt={method.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <i
                        className={`${method.iconClass} text-blue-400 text-xl`}
                      ></i>
                    )}
                    <span className="font-semibold">{method.name}</span>
                  </button>
                ))}
              </div>
            )}
            {groupedMethods.crypto && (
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Crypto
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {groupedMethods.crypto.map((crypto) => (
                    <button
                      key={crypto.id}
                      onClick={() => handleSelectCrypto(crypto.name)}
                      className="bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 p-4 rounded-lg text-center flex flex-col items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                      {crypto.iconClass.startsWith('http') ? (
                        <img
                          src={crypto.iconClass}
                          alt={crypto.name}
                          className="w-10 h-10 object-contain mb-2"
                        />
                      ) : (
                        <i
                          className={`${crypto.iconClass} text-3xl mb-2 text-blue-500 dark:text-blue-400`}
                        ></i>
                      )}
                      <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                        {crypto.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-semibold">
                    Show All
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div
          className="bg-white dark:bg-[#141c2f] rounded-lg shadow-xl w-full max-w-2xl text-slate-8
00 dark:text-slate-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex border-b border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === 'withdraw'
                      ? 'text-slate-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === 'history'
                      ? 'text-slate-900 dark:text-white border-b-2 border-blue-500'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  History
                </button>
              </div>
              <button
                onClick={closeModal}
                className="text-3xl font-light text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            {activeTab === 'withdraw'
              ? renderWithdrawContent()
              : <TransactionHistory />}
          </div>
        </div>
      </div>

      <BlockedWithdrawModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
      />
    </>
  );
};

export default WalletModal;
