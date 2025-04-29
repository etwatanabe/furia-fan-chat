import React from 'react';
import styled from 'styled-components';
import ChatContainer from '../components/chat/ChatContainer';
import { ChatProvider } from '../context/ChatContext';
import MainLayout from '../components/layout/MainLayout';

const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  height: calc(100vh - 80px);
  width: 100%;
  background-color: #0a0a0a;
  background-image: url('/assets/images/background.png');
  background-size: cover;
  background-position: top;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 1;
  }
`;

const ChatWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 700px;
  height: 100%;
  display: flex;
  
`;

const Chat: React.FC = () => {
  return (
    <ChatProvider>
      <MainLayout>
        <ChatPageContainer>
          <ChatWrapper>
            <ChatContainer />
          </ChatWrapper>
        </ChatPageContainer>
      </MainLayout>
    </ChatProvider>
  );
};

export default Chat;