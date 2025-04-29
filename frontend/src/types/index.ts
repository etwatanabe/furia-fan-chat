export interface SuggestedResponse {
    text: string;
  }
  
  export interface Message {
    _id: string;
    content: string;
    sender: 'user' | 'bot';
    isBot: boolean;
    suggestedResponses?: SuggestedResponse[];
    timestamp: string;
  }
  
  export type ChatContextType = {
    state: ChatState;
    startConversation: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
  };
  
  export type ChatState = {
    currentState: string;
    messages: Message[];
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
  };