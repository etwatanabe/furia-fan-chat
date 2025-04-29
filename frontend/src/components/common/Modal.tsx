import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  showButtons?: boolean;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-index-modal, 1000);
  padding: 20px;
`;

const ModalContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  background-color: #ff5500;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 600;
  font-size: 18px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  color: #cccccc;
  font-size: 16px;
`;

const ModalFooter = styled.div`
  padding: 10px 20px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  showButtons = true
}) => {
  useEffect(() => {
    // Impedir rolagem do body quando modal estiver aberto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Não renderizar se modal não estiver aberto
  if (!isOpen) return null;

  // Função para prevenir que cliques no modal fechem o overlay
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={handleModalClick}>
        <ModalHeader>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {showButtons && (
          <ModalFooter>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button primary onClick={onConfirm}>
              {confirmText}
            </Button>
          </ModalFooter>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;