const logger = require('../../utils/logger');
const dialogTreeManager = require('./dialogTree');

// Formatar próximo jogo
function formatNextMatch(match, teamName) {
  // Identificar o oponente
  const opponent = match.teamA.includes(teamName) ? match.teamB : match.teamA;
  
  // Formatar data e hora
  const dateTime = match.date ? 
                  (match.time ? `${match.date} às ${match.time}` : match.date) : 
                  'data a definir';
  
  // Formatar evento
  const eventInfo = match.tournament ? ` no evento ${match.tournament}` : '';
  
  return `O próximo jogo da ${teamName} será contra ${opponent}${eventInfo}, em ${dateTime}.`;
}

// Formatar histórico de partidas
function formatMatchHistory(matches, teamName) {
  let content = `Resultados recentes da ${teamName}:\n\n`;
  
  matches.forEach(match => {
    const formattedMatch = formatMatchResult(match, teamName);
    content += `${formattedMatch}\n\n`;
  });
  
  return content;
}

// Formatar resultado de uma partida
function formatMatchResult(match, teamName) {
  const isTeamA = match.teamA.includes(teamName);
  const scoreA = parseInt(match.scoreA) || 0;
  const scoreB = parseInt(match.scoreB) || 0;
  
  // Determinar resultado
  const result = isTeamA ?
    (scoreA > scoreB ? "✅ Vitória" : "❌ Derrota") :
    (scoreB > scoreA ? "✅ Vitória" : "❌ Derrota");
  
  // Formatar linha
  const dateTime = [match.date, match.time ? `às ${match.time}` : ''].filter(Boolean).join(' ');
  const matchInfo = `${dateTime}: ${match.teamA} ${match.scoreA} x ${match.scoreB} ${match.teamB} - ${result}`;
  const tournamentInfo = match.tournament ? ` (${match.tournament})` : '';
  
  return `${matchInfo}${tournamentInfo}`;
}

// Formatar escalação
function formatLineup(titular, substitute, staff, teamName) {
  let content = `Escalação atual da ${teamName} CS2:\n\n`;
  
  if (titular.length > 0) {
    content += `🏆 Titulares: ${titular.join(', ')}\n\n`;
  }
  
  if (substitute.length > 0) {
    content += `🔄 Reservas: ${substitute.join(', ')}\n\n`;
  }
  
  if (staff.length > 0) {
    content += `👨‍💻 Comissão técnica: ${staff.join(', ')}`;
  }
  
  return content;
}

// Obter escalação padrão
function getDefaultLineup(teamName) {
  return `A escalação atual da ${teamName} CS2:\n\n🏆 Titulares: MOLODOY, YEKINDAR, FalleN, KSCERATO e yuurih\n\n🔄 Reservas: skullz, chelo\n\n👨‍💻 Comissão técnica: Hepa, sidde`;
}

// Tratar erros de atualização
function handleUpdateError(dialogTree, nodeKey, errorMessage, teamName) {
  logger.error(errorMessage);
  
  // Garantir estrutura mínima
  dialogTreeManager.ensureNode(dialogTree, nodeKey, {
    suggestedResponses: dialogTreeManager.getDefaultTree()[nodeKey]?.suggestedResponses || [],
    intents: dialogTreeManager.getDefaultTree()[nodeKey]?.intents || {}
  });
  
  // Definir mensagem de erro apropriada
  const errorMessages = {
    next_game: `Sem jogos próximos. Não veremos a ${teamName} jogar por enquanto...`,
    current_lineup: getDefaultLineup(teamName),
    match_history: `Desculpe, estou com problemas para acessar o histórico de partidas da ${teamName}.`
  };
  
  dialogTree[nodeKey].content = errorMessages[nodeKey];
}

module.exports = {
  formatNextMatch,
  formatMatchHistory,
  formatMatchResult,
  formatLineup,
  getDefaultLineup,
  handleUpdateError
};