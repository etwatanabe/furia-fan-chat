import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '../components/layout/MainLayout';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: calc(100vh - 120px);
  background-color: #0a0a0a;
  background-image: url('/assets/images/background.png');
  background-size: cover;
  background-position: top;
  position: relative;
  margin: 0;
  width: 100%;
  flex: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 1;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: white;
  margin-bottom: 16px;
  
  span {
    color: #ff5500;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 60px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 14px 28px;
  background-color: #ff5500;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 1.1rem;
  
  &:hover {
    background-color: #e64d00;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 85, 0, 0.3);
  }
`;

const Features = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  width: 100%;
  margin-top: 40px;
`;

const FeatureCard = styled.div`
  background-color: rgba(26, 26, 26, 0.7);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px;
  flex: 1;
  min-width: 280px;
  max-width: 380px;
  text-align: center;
  border-top: 4px solid #ff5500;
  
  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  color: white;
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: #ccc;
  font-size: 1rem;
  line-height: 1.5;
`;

const Home: React.FC = () => {
  return (
    <MainLayout>
      <HomeContainer>
        <Content>
          <Title>
            <span>FURIA</span> Fan Chat
          </Title>
          <Subtitle>
            Conecte-se com o universo da FURIA através do nosso chatbot interativo. 
            Fique por dentro de notícias, calendário de jogos, estatísticas dos jogadores e muito mais!
          </Subtitle>

          <ButtonContainer>
            <Button to="/chat">Iniciar Conversa</Button>
          </ButtonContainer>

          <Features>
            <FeatureCard>
              <FeatureTitle>Informações em Tempo Real</FeatureTitle>
              <FeatureDescription>
                Acompanhe o calendário de jogos, resultados recentes e notícias sobre a FURIA.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureTitle>Estatísticas de Jogadores</FeatureTitle>
              <FeatureDescription>
                Acesse dados detalhados sobre o desempenho da equipe e jogadores individuais.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureTitle>Experiência Personalizada</FeatureTitle>
              <FeatureDescription>
                Interaja com o bot da maneira que preferir, obtendo informações específicas sobre seus interesses.
              </FeatureDescription>
            </FeatureCard>
          </Features>
        </Content>
      </HomeContainer>
    </MainLayout>
  );
};

export default Home;