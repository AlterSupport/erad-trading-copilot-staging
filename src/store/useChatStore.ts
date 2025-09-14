import { create } from 'zustand';
import { Message, messagesData } from '@/lib/message-data';

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: messagesData,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
