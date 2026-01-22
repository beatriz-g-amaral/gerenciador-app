import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { initializeChat, sendMessage } from '../services/aiService';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

interface ChatbotProps {
    onClose: () => void;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose, setUnreadCount }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedMessages = sessionStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        initializeChat();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);

        const handleSend = async () => {
            if (input.trim() || isLoading) {
                const userMessage: Message = { text: input, sender: 'user' };
                setMessages(prevMessages => [...prevMessages, userMessage]);
                setInput('');
                setIsLoading(true);
                try {
                    const aiText = await sendMessage(input);
                    const aiMessage: Message = { text: aiText, sender: 'ai' };
                    setMessages(prevMessages => [...prevMessages, aiMessage]);
                    setUnreadCount(prev => prev + 1);
                } catch (error) {
                    console.error("Error sending message:", error);
                    const errorMessage: Message = { text: "Desculpe, não consegui me conectar. Tente novamente.", sender: 'ai' };
                    setMessages(prevMessages => [...prevMessages, errorMessage]);
                } finally {
                    setIsLoading(false);
                }
            }
        };
    
        const handleClearChat = () => {
            setMessages([]);
            sessionStorage.removeItem('chatMessages');
            initializeChat();
        };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div className="chatbot-title">
                    <img src="/HelpIA.png" alt="Chat Icon" className="chat-header-icon" />
                    <div>
                        <h2>AI Chat</h2>
                        <p className="session-disclaimer">Sua conversa dura apenas nesta sessão</p>
                    </div>
                </div>
                <div className="header-buttons">
                    <button onClick={handleClearChat} className="clear-button">Encerrar</button>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && (
                    <div className="message ai typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
