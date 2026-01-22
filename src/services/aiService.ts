import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { routerInstruction, zap3storInstruction, whatsappZap3storInstruction, backendZap3storInstruction } from "./instructions";

let chat: ChatSession | undefined;
let currentInstruction = routerInstruction;

export const initializeChat = (instruction: any = routerInstruction) => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("REACT_APP_GEMINI_API_KEY is not defined");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    chat = model.startChat({
        generationConfig: {
            maxOutputTokens: 1000,
        },
        systemInstruction: instruction,
    });
    currentInstruction = instruction;
};

export const sendMessage = async (message: string) => {
    if (!chat || currentInstruction === routerInstruction) {
        initializeChat(routerInstruction);
        if (!chat) {
            throw new Error("Chat not initialized");
        }
        const result = await chat.sendMessageStream(message);
        let routerResponse = '';
        for await (const chunk of result.stream) {
            routerResponse += chunk.text();
        }

        const specialist = routerResponse.trim().toUpperCase();
        let newInstruction = null;
        let specialistName = '';

        switch (specialist) {
            case 'ZAP3STOR':
                newInstruction = zap3storInstruction;
                specialistName = 'Zap3stor';
                break;
            case 'WHATSAPP':
                newInstruction = whatsappZap3storInstruction;
                specialistName = 'WhatsApp com Zap3stor';
                break;
            case 'BACKEND':
                newInstruction = backendZap3storInstruction;
                specialistName = 'Backend Zap3stor';
                break;
            default:
                return routerResponse;
        }

        initializeChat(newInstruction);
        const transferMessage = `Entendi. Vou te transferir para o especialista em ${specialistName}.\n\n`;
        
        if (!chat) {
            throw new Error("Chat not initialized for the specialist");
        }
        const specialistResult = await chat.sendMessageStream(message);
        let specialistResponse = '';
        for await (const chunk of specialistResult.stream) {
            specialistResponse += chunk.text();
        }

        return transferMessage + specialistResponse;
    }

    const result = await chat.sendMessageStream(message);
    let text = '';
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
    }
    return text;
};
