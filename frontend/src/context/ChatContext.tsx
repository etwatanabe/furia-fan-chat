import React, { createContext, useReducer, useEffect } from 'react';
import { ChatState, ChatContextType, Message } from '../types';
import chatService from '../services/chatService';
import { getItem, setItem } from '../utils/storage';

// Estado inicial do chat
const initialState: ChatState = {
  currentState: 'initial',
  messages: [],
  loading: false,
  error: null,
  isInitialized: false
};

// Tipo das ações do reducer
type ChatAction =
  | { type: 'SET_LOADING' }
  | { type: 'START_CHAT_SUCCESS'; payload: Message }
  | { type: 'SEND_MESSAGE_SUCCESS'; payload: { userMessage: Message; botResponse: Message; nextState: string } }
  | { type: 'CHAT_ERROR'; payload: string }
  | { type: 'INITIALIZE_FROM_STORAGE'; payload: ChatState };

// Criação do contexto
const ChatContext = createContext<ChatContextType>({
  state: initialState,
  startConversation: async () => {},
  sendMessage: async () => {}
});

// Reducer para gerenciamento do estado
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
      
    case 'START_CHAT_SUCCESS':
      return {
        ...state,
        messages: [action.payload],
        loading: false,
        error: null,
        isInitialized: true
      };
      
    case 'SEND_MESSAGE_SUCCESS':
      return {
        ...state,
        messages: [...state.messages, action.payload.userMessage, action.payload.botResponse],
        currentState: action.payload.nextState,
        loading: false,
        error: null
      };
      
    case 'CHAT_ERROR':
      return { ...state, loading: false, error: action.payload };
      
    case 'INITIALIZE_FROM_STORAGE':
      return { ...action.payload, loading: false, error: null, isInitialized: true };
      
    default:
      return state;
  }
};

// Storage keys
const STORAGE_KEY = 'furia_chat_state';

// Provider do contexto
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Carregar estado salvo ao inicializar
  useEffect(() => {
    const savedState = getItem<ChatState | null>(STORAGE_KEY, null);
    if (savedState && savedState.messages.length > 0) {
      dispatch({ type: 'INITIALIZE_FROM_STORAGE', payload: savedState });
    } else {
      // Se não houver estado salvo, iniciar nova conversa
      startConversation();
    }
  }, []);

  // Salvar estado a cada alteração
  useEffect(() => {
    if (state.isInitialized) {
      setItem(STORAGE_KEY, state);
    }
  }, [state]);

  // Iniciar nova conversa
  const startConversation = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const { initialMessage } = await chatService.getInitialMessage();
      dispatch({ type: 'START_CHAT_SUCCESS', payload: initialMessage });
    } catch (err: any) {
      dispatch({ 
        type: 'CHAT_ERROR', 
        payload: err.response?.data?.message || 'Erro ao iniciar conversa' 
      });
    }
  };

  // Enviar mensagem
  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    dispatch({ type: 'SET_LOADING' });
    try {
      const { userMessage, botResponse, nextState } = await chatService.sendMessage(
        message,
        state.currentState
      );
      
      dispatch({ 
        type: 'SEND_MESSAGE_SUCCESS', 
        payload: { userMessage, botResponse, nextState } 
      });
    } catch (err: any) {
      dispatch({ 
        type: 'CHAT_ERROR', 
        payload: err.response?.data?.message || 'Erro ao enviar mensagem' 
      });
    }
  };

  return (
    <ChatContext.Provider value={{ 
      state, 
      startConversation, 
      sendMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;