import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'white';
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const getSizeInPixels = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return '24px';
    case 'large':
      return '48px';
    case 'medium':
    default:
      return '36px';
  }
};

const getColorValue = (color: 'primary' | 'white') => {
  switch (color) {
    case 'primary':
      return '#ff5500';
    case 'white':
    default:
      return '#ffffff';
  }
};

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

const SpinnerContainer = styled.div<LoaderProps>`
  width: ${props => getSizeInPixels(props.size || 'medium')};
  height: ${props => getSizeInPixels(props.size || 'medium')};
  position: relative;
`;

const Spinner = styled.div<LoaderProps>`
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid ${props => getColorValue(props.color || 'primary')};
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: ${spin} 0.8s linear infinite;
`;

const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = 'primary' }) => {
  return (
    <LoaderContainer>
      <SpinnerContainer size={size}>
        <Spinner size={size} color={color} />
      </SpinnerContainer>
    </LoaderContainer>
  );
};

export default Loader;