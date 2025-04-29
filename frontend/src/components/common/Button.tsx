import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps {
  primary?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  border: none;
  
  ${props => props.primary ? css`
    background-color: #ff5500;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #e64d00;
    }
  ` : css`
    background-color: transparent;
    color: #ff5500;
    border: 1px solid #ff5500;
    
    &:hover:not(:disabled) {
      background-color: rgba(255, 85, 0, 0.1);
    }
  `}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;

const Button: React.FC<ButtonProps> = ({ 
  children,
  type = 'button',
  ...rest
}) => {
  return (
    <StyledButton type={type} {...rest}>
      {children}
    </StyledButton>
  );
};

export default Button;