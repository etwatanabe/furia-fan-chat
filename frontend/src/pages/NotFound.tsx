import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/common/Button';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(100vh - 160px); /* Altura da viewport - (header + footer) */
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 8rem;
  color: #ff5500;
  margin: 0;
  font-weight: 900;
  line-height: 1;
  
  @media (max-width: 576px) {
    font-size: 6rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 2.5rem;
  color: white;
  margin-top: 16px;
  margin-bottom: 30px;
  
  @media (max-width: 576px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  max-width: 500px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NotFound: React.FC = () => {
  return (
    <MainLayout>
      <NotFoundContainer>
        <Title>404</Title>
        <Subtitle>Página não encontrada</Subtitle>
        <Description>
          A página que você está procurando pode ter sido removida, renomeada 
          ou está temporariamente indisponível.
        </Description>
        <ButtonContainer>
          <Link to="/">
            <Button primary>Voltar para a Página Inicial</Button>
          </Link>
          <Link to="/chat">
            <Button>Ir para o Chat</Button>
          </Link>
        </ButtonContainer>
      </NotFoundContainer>
    </MainLayout>
  );
};

export default NotFound;