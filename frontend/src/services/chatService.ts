import api from './api';
import { Message } from '../types';

export interface InitialMessageResponse {
  success: boolean;
  initialMessage: Message;
}

export interface SendMessageResponse {
  success: boolean;
  userMessage: Message;
  botResponse: Message;
  nextState: string;
}

const chatService = {
  // Obter mensagem inicial do bot
  getInitialMessage: async (): Promise<InitialMessageResponse> => {
    const response = await api.get('/chatbot/initial');
    return response.data;
  },

  // Enviar mensagem para o bot
  sendMessage: async (message: string, currentState: string): Promise<SendMessageResponse> => {
    const response = await api.post('/chatbot/message', {
      message,
      currentState
    });
    return response.data;
  }
};

export default chatService;