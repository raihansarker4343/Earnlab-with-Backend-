import React, { useState, useEffect } from 'react';
import { API_URL } from '../../constants';
import type { SurveyProvider } from '../../types';

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-green-500' : 'bg-slate-300'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const SurveyControlPage: React.FC = () => {
    const [providers, setProviders] = useState<SurveyProvider[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; logo: string }>({ name: '', logo: '' });

    useEffect(() => {
        const fetchProviders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication failed.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/admin/survey-providers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch survey providers.');
                }
                const data: SurveyProvider[] = await response.json();
                setProviders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProviders();
    }, []);

    const handleToggle = async (id: number, currentStatus: boolean) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication failed.');
            return;
        }

        const originalProviders = [...providers];
        const updatedProviders = providers.map(p => p.id === id ? { ...p, isEnabled: !currentStatus } : p);
        setProviders(updatedProviders);

        try {
            const response = await fetch(`${API_URL}/api/admin/survey-providers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isEnabled: !currentStatus })
            });
            if (!response.ok) {
                throw new Error('Failed to update status.');
            }
        } catch (err) {
            alert('Error updating status. Reverting changes.');
            setProviders(originalProviders);
        }
    };

    const startEdit = (provider: SurveyProvider) => {
        setEditingId(provider.id);
        setEditForm({ name: provider.name, logo: provider.logo });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', logo: '' });
    };

    const saveEdit = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/survey-providers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            
            if (!response.ok) throw new Error('Failed to update provider');
            
            const updatedProvider = await response.json();
            setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updatedProvider } : p));
            setEditingId(null);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (isLoading) return <div>Loading survey providers...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Survey Provider Control</h2>
                <p className="text-slate-500 mt-1">Enable, disable, or edit survey providers.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-slate-500">
                            <th className="p-3 font-semibold">Provider Info</th>
                            <th className="p-3 font-semibold">Type</th>
                            <th className="p-3 font-semibold text-center">Status</th>
                            <th className="p-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {providers.map(provider => (
                            <tr key={provider.id} className="border-b border-slate-200">
                                <td className="p-3">
                                    {editingId === provider.id ? (
                                        <div className="space-y-2">
                                            <input 
                                                type="text" 
                                                value={editForm.name} 
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                className="border p-1 rounded w-full text-xs"
                                                placeholder="Name"
                                            />
                                            <input 
                                                type="text" 
                                                value={editForm.logo} 
                                                onChange={e => setEditForm({...editForm, logo: e.target.value})}
                                                className="border p-1 rounded w-full text-xs"
                                                placeholder="Logo URL"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <img src={provider.logo} alt={provider.name} className="h-8 w-auto bg-slate-100 p-1 rounded-md" />
                                            <span className="font-medium text-slate-800">{provider.name}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3">{provider.type}</td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${provider.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {provider.isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <ToggleSwitch enabled={provider.isEnabled} onToggle={() => handleToggle(provider.id, provider.isEnabled)} />
                                        {editingId === provider.id ? (
                                            <>
                                                <button onClick={() => saveEdit(provider.id)} className="text-green-600 hover:text-green-800"><i className="fas fa-check"></i></button>
                                                <button onClick={cancelEdit} className="text-red-500 hover:text-red-700"><i className="fas fa-times"></i></button>
                                            </>
                                        ) : (
                                            <button onClick={() => startEdit(provider)} className="text-blue-500 hover:text-blue-700"><i className="fas fa-pencil-alt"></i></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SurveyControlPage;