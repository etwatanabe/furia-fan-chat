import React from 'react';
import styled from 'styled-components';
import { SuggestedResponse } from '../../types';

interface SuggestedResponsesProps {
  responses: SuggestedResponse[];
  onResponseClick: (text: string) => void;
}

const ResponsesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 10px;
  max-width: 100%; /* Limita a largura máxima */
`;

const ResponseButton = styled.button`
  background-color: transparent;
  border: 1px solid #ff5500;
  color: #ff5500;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-overflow: ellipsis; /* Adiciona reticências se o texto for muito longo */
  overflow: hidden;
  white-space: nowrap;
  max-width: 100%;
  
  &:hover {
    background-color: rgba(255, 85, 0, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SuggestedResponses: React.FC<SuggestedResponsesProps> = ({ responses, onResponseClick }) => {
  if (!responses || responses.length === 0) return null;
  
  return (
    <ResponsesContainer>
      {responses.map((response, index) => (
        <ResponseButton 
          key={index} 
          onClick={() => onResponseClick(response.text)}
        >
          {response.text}
        </ResponseButton>
      ))}
    </ResponsesContainer>
  );
};

export default SuggestedResponses;