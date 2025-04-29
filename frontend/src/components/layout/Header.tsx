import React from 'react';
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

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 24px;
  font-weight: 700;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const LogoText = styled.span`
  color: #ff5500;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
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
`;

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderContainer>
      <Logo to="/">
        <img src="/assets/images/furia-logo.png" alt="FURIA Logo" />
        <LogoText>FURIA</LogoText> Fan Chat
      </Logo>
      
      <Nav>
        <NavLink to="/" active={isActive('/')}>Início</NavLink>
        <NavLink to="/chat" active={isActive('/chat')}>Chat</NavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;