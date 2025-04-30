import React from 'react';
import styled from 'styled-components';
import { Message } from '../../types';
import SuggestedResponses from './SuggestedResponses';
import { useChat } from '../../hooks/useChat';

interface ChatMessageProps {
  message: Message;
}

interface MessageContainerProps {
  isBot: boolean;
}

interface TimestampProps {
  isBot?: boolean;
}

const MessageContainer = styled.div<MessageContainerProps>`
  display: flex;
  flex-direction: column;
  width: auto;
  max-width: 80%;
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
`;

const MessageHeader = styled.div<{ isBot: boolean }>`
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  display: ${props => props.isBot ? 'flex' : 'none'};
`;

const SenderAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: #ff5500;
  background-image: url('/assets/images/chatbot-profile.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const SenderName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #ff5500;
`;

const MessageBubble = styled.div<MessageContainerProps>`
  padding: 10px 14px;
  border-radius: 12px;
  color: #fff;
  background-color: ${props => props.isBot ? '#2b2b2b' : '#ff5500'};
  white-space: pre-wrap;
  word-wrap: break-word; 
  overflow-wrap: break-word;
  line-height: 1.5;
  font-size: 15px;
  max-width: 100%;
`;

const Timestamp = styled.span<TimestampProps>`
  font-size: 11px;
  color: #777;
  margin-top: 3px;
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
`;


const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { sendMessage } = useChat();
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSuggestedResponseClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <MessageContainer isBot={message.isBot}>
      <MessageHeader isBot={message.isBot}>
        <SenderAvatar />
        <SenderName>Panthera</SenderName>
      </MessageHeader>
      
      <MessageBubble isBot={message.isBot}>
        {message.content}
      </MessageBubble>
      
      {message.suggestedResponses && message.isBot && (
        <SuggestedResponses 
          responses={message.suggestedResponses} 
          onResponseClick={handleSuggestedResponseClick}
        />
      )}
      
      <Timestamp isBot={message.isBot}>{formatTimestamp(message.timestamp)}</Timestamp>
    </MessageContainer>
  );
};

export default ChatMessage;