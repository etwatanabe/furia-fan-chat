import React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px); /* Ajuste para o footer */
  padding: 0;
  margin: 0;
  width: 100%;
  background-color: #0a0a0a;
`;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;