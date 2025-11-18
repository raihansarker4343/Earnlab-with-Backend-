import React, { useState, useRef, useEffect, useContext } from 'react';
import { CHAT_MESSAGES } from '../../constants';
import type { ChatMessage } from '../../types';
import { AppContext } from '../../App';
import { GoogleGenAI } from '@google/genai';

const ChatPage: React.FC = () => {
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
      if (process.env.API_KEY) {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
      }
    }, []);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || isSending) return;

        setIsSending(true);

        // AI Content Moderation
        if (aiRef.current) {
            try {
                const moderationPrompt = `Is the following message appropriate for a community chat? Message: "${newMessage}". Respond with only 'YES' or 'NO'.`;
                const response = await aiRef.current.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: moderationPrompt,
                });
                
                const moderationResult = response.text.trim().toUpperCase();
                if (moderationResult !== 'YES') {
                    alert('This message has been flagged as inappropriate and cannot be sent.');
                    setIsSending(false);
                    setNewMessage('');
                    return;
                }
            } catch (error) {
                console.error('Error with content moderation:', error);
                // Fail open: if moderation fails, allow the message.
            }
        }


        const message: ChatMessage = {
            id: messages.length + 1,
            user: user.username,
            avatar: user.avatarUrl || `https://i.pravatar.cc/32?u=${user.username}`,
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSelf: true,
        };

        setMessages([...messages, message]);
        setNewMessage('');
        setIsSending(false);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Community Chat</h1>
                <p className="text-slate-500 dark:text-slate-400">Talk with other EarnLab users in real-time.</p>
            </div>
            
            <div className="bg-white dark:bg-[#1e293b] h-[60vh] flex flex-col rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.isSelf ? 'flex-row-reverse' : ''}`}>
                            <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full" />
                            <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${msg.isSelf ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                                <div className="flex items-baseline gap-2">
                                    <p className={`font-bold text-sm ${msg.isSelf ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{msg.user}</p>
                                    <p className={`text-xs ${msg.isSelf ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>{msg.timestamp}</p>
                                </div>
                                <p className="text-sm mt-1">{msg.message}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isSending}
                            className="flex-1 bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform active:scale-95 disabled:bg-slate-500 disabled:cursor-not-allowed"
                            disabled={isSending}
                        >
                            <span>{isSending ? 'Checking...' : 'Send'}</span>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;