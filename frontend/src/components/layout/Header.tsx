import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #111;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ff5500;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const LogoTextContainer = styled.div`
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  @media (min-width: 769px) {
    flex-direction: row;
    align-items: baseline;
  }
`;

const LogoText = styled.span`
  color: #ff5500;
  font-size: 24px;
  font-weight: 700;
  
  @media (min-width: 769px) {
    margin-right: 8px;
  }
`;

const LogoRegularText = styled.span`
  color: #fff;
  font-size: 24px;
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 70px;
    right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
    background-color: #111;
    flex-direction: column;
    width: 200px;
    border-left: 2px solid #ff5500;
    border-bottom: 2px solid #ff5500;
    transition: right 0.3s ease;
    padding: 20px 0;
    z-index: 999;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? '#ff5500' : '#fff'};
  text-decoration: none;
  margin-left: 20px;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 85, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    margin: 8px 0;
    width: 80%;
    text-align: center;
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer>
      <LogoContainer to="/">
        <img src="/assets/images/furia-logo.png" alt="FURIA Logo" />
        <LogoTextContainer>
          <LogoText>FURIA</LogoText>
          <LogoRegularText>Fan Chat</LogoRegularText>
        </LogoTextContainer>
      </LogoContainer>
      
      <MenuButton onClick={toggleMenu}>
        {isOpen ? '✕' : '☰'}
      </MenuButton>
      
      <Nav isOpen={isOpen}>
        <NavLink to="/" active={isActive('/')} onClick={() => setIsOpen(false)}>
          Início
        </NavLink>
        <NavLink to="/chat" active={isActive('/chat')} onClick={() => setIsOpen(false)}>
          Chat
        </NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;