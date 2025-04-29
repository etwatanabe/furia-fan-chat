import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #121212;
  color: #888;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #333;
  margin-top: 0;
  width: 100%;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  
  a {
    color: #ff5500;
    text-decoration: none;
    margin: 0 15px;
    transition: color 0.2s ease;
    
    &:hover {
      color: #ff7733;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterLinks>
          <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">Site Oficial</a>
          <a href="https://twitter.com/furia" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com/furiagg" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://twitch.tv/furiatv" target="_blank" rel="noopener noreferrer">Twitch</a>
        </FooterLinks>
        <p>&copy; {new Date().getFullYear()} FURIA Fan Chat. Todos os direitos reservados.</p>
        <p>Projeto desenvolvido para a vaga de assistente de desenvolvimento de software na FURIA.</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;