import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chat, setChat] = useState(null);

    useEffect(() => {
        const initChat = () => {
            const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
            });
            const systemInstruction = {
                role: "system",
                parts: [{ text: "Você é um operador de suporte técnico para a plataforma Zap3stor. Sua função é ajudar os usuários com erros de conexão envolvendo Live Helper Chat, OpenWA, o aplicativo Zap3stor React e o site Zap3stor. Responda sempre em português do Brasil. Use este link exclusivamente para obter instruções e tutoriais sobre o aplicativo Zap3stor: https://suporte.webplanet.com.br/books/tutorial-completo-dominando-as-funcionalidades-do-sistema. Forneça soluções de problemas passo a passo para falhas de conexão, garantindo que o usuário entenda se o problema está no ambiente local, no frontend React ou no serviço OpenWA/Live Helper. Mantenha um tom profissional, técnico e paciente." }],
            };

            setChat(model.startChat({
                history: messages.map(msg => ({
                    parts: [{ text: msg.text }],
                    role: msg.sender === 'user' ? 'user' : 'model'
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
                systemInstruction,
            }));
        };
        initChat();
    }, []);


    const handleSend = async () => {
        if (input.trim() && chat) {
            const userMessage = { text: input, sender: 'user' };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInput('');

            const result = await chat.sendMessageStream(input);
            let text = '';
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                text += chunkText;
            }

            const aiMessage = { text: text, sender: 'ai' };
            setMessages(prevMessages => [...prevMessages, aiMessage]);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>AI Chat</h2>
                <button onClick={onClose}>X</button>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
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
