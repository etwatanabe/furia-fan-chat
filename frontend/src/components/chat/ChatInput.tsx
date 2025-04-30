import React, { useState, KeyboardEvent as ReactKeyboardEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const InputContainer = styled.div`
  padding: 14px;
  background-color: #252525;
  border-top: 1px solid #333;
  width: 100%;
`;

const InputForm = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 11px 16px;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 30px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #ff5500;
    box-shadow: 0 0 0 2px rgba(255, 85, 0, 0.2);
  }
  
  &::placeholder {
    color: #666;
  }
  
  &:disabled {
    background-color: #2a2a2a;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 9px 18px;
  background-color: #ff5500;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  
  &:hover:not(:disabled) {
    background-color: #e64d00;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #5a5a5a;
    cursor: not-allowed;
  }
`;

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);
  
  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };
  
  const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <InputContainer>
      <InputForm onSubmit={handleSubmit}>
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
        />
        <SendButton 
          type="submit" 
          disabled={!message.trim() || isLoading || disabled}
        >
          Enviar
        </SendButton>
      </InputForm>
    </InputContainer>
  );
};

export default ChatInput;