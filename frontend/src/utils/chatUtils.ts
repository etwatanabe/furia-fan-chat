/** 
 * Função para limpar o histórico de conversas do localStorage
 */
export const clearChatHistory = (): boolean => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.includes('chat') || key.includes('furia')) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Erro ao limpar histórico de conversas:', error);
    return false;
  }
};