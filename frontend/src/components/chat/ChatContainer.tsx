import React, { useRef, useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import styled from 'styled-components';
import { useChat } from '../../hooks/useChat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import { clearChatHistory } from '../../utils/chatUtils';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ClearButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 85, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #ff5500;
    transform: scale(1.05);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scroll-behavior: smooth;
`;

const EmptyStateMessage = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #999;
  gap: 16px;
  height: 300px;

  h3 {
    color: #ccc;
    margin-bottom: 0;
  }

  p {
    margin: 0;
    max-width: 300px;
  }
`;

const ErrorMessage = styled.div`
  padding: 10px 14px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 8px;
  color: #ff5555;
  margin: 8px 0;
  text-align: center;
  font-size: 14px;
`;

const TrashIcon = FaTrash as unknown as React.FC<{ size?: number }>;

const ChatContainer: React.FC = () => {
  const { state, sendMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para garantir que cada mensagem tenha um _id válido
  const getMessageWithId = (message: any) => {
    if (!message) return { _id: uuidv4(), content: "Erro na mensagem", isBot: true, sender: 'bot', timestamp: new Date().toISOString() };
    
    // Se a mensagem não tiver _id, crie um novo
    return message._id ? message : { ...message, _id: uuidv4() };
  };

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Scroll quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

    // Função para limpar o histórico
    const handleClearHistory = () => {
      setIsModalOpen(true);
    };

    // Função executada quando o usuário confirma a limpeza do histórico
    const confirmClearHistory = () => {
      const success = clearChatHistory();
      
      if (success) {
        window.location.reload();
      } else {
        // Poderia mostrar outro modal de erro aqui, por simplicidade usaremos alert
        alert('Não foi possível limpar o histórico. Tente novamente.');
      }
      
      setIsModalOpen(false);
    };

  // Processar mensagens para garantir que todas tenham _id válido
  const processedMessages = state.messages.map(getMessageWithId);

  return (
    <Container>
      <ClearButton onClick={handleClearHistory} title="Limpar histórico de conversa">
        <TrashIcon size={16} />
      </ClearButton>
      <MessagesContainer ref={messagesContainerRef}>
        {processedMessages.length === 0 ? (
          <EmptyStateMessage>
            <h3>Carregando conversa...</h3>
            <p>Estamos preparando tudo para você conversar com o bot da FURIA.</p>
            <Loader size="medium" color="primary" />
          </EmptyStateMessage>
        ) : (
          <>
            {processedMessages.map((message) => (
              <ChatMessage key={message._id} message={message} />
            ))}
            {state.loading}
            {state.error && <ErrorMessage>{state.error}</ErrorMessage>}
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={state.loading} 
        disabled={state.loading || !state.isInitialized} 
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmClearHistory}
        title="Limpar Histórico"
        confirmText="Limpar"
        cancelText="Cancelar"
      >
        <p>
          Tem certeza que deseja limpar todo o histórico de conversas? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </Container>
  );
};

export default ChatContainer;