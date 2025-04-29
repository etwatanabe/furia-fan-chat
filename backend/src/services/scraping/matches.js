const logger = require('../../utils/logger');

// Método para extrair partidas (tanto futuras quanto passadas)
async function extractMatches($, isUpcoming = false, teamName) {
  // Determinar qual cabeçalho procurar
  const headerKeywords = isUpcoming ? ['jogos', 'próximos'] : ['resultados', 'histórico'];
  const matches = [];
  let currentDate = '';
  
  // Procurar pelo cabeçalho apropriado
  $('h2, h3, h4').each((i, header) => {
    const headerText = $(header).text().trim().toLowerCase();
    
    // Verificar se é o tipo de cabeçalho que procuramos
    if (headerKeywords.some(keyword => headerText.includes(keyword))) {
      logger.debug(`Encontrado cabeçalho relevante: ${headerText}`);
      
      // Procurar data e cards de jogos após o cabeçalho
      $(header).nextUntil('h2, h3, h4').each((j, element) => {
        // Atualizar data se for um elemento de data
        if ($(element).text().match(/feira|domingo|sábado|de\s+\w+/i)) {
          currentDate = $(element).text().replace(/[🗓📅]/g, '').trim();
          logger.debug(`Data encontrada: ${currentDate}`);
        }
        
        // Procurar cards de partidas
        $(element).find('[class*="MatchTeams"]').each((k, card) => {
          if (matches.length >= 5 && !isUpcoming) return false;

          // Extrair times por seletores de classe específicos
          const teams = [];
          $(card).find('[class*="TeamName"]').each((l, team) => {
            const teamText = $(team).text().trim();
            if (teamText && !teams.includes(teamText)) {
              teams.push(teamText);
            }
          });
          
          let teamA = teams[0], teamB = teams[1];
          
          // Extrair placar
          let scoreA = '0', scoreB = '0';
          const scoreElements = $(card).find('[class*="Score"], [class*="score"]');
          
          if (scoreElements.length >= 2) {
            scoreA = $(scoreElements[0]).text().trim();
            scoreB = $(scoreElements[1]).text().trim();
          } else {

          }
          
          // Extrair hora
          let time = '';
          const timeElement = $(card).find('time, small, [class*="Time"], [class*="time"]');
          if (timeElement.length) {
            time = $(timeElement).first().text().trim();
          }
          
          if (!time) {
            // Tentar extrair hora via regex (formato HH:MM)
            const cardText = $(card).text().trim();
            const timeMatch = cardText.match(/(\d{1,2}:\d{2})/);
            if (timeMatch) {
              time = timeMatch[1];
            }
          }
          
          // Extrair torneio 
          let tournament = '';
          const tournamentSelectors = [
            '[class*="Tournament"]', 
            '[class*="tournament"]',
            '[class*="Event"]',
            '[class*="event"]',
            '[class*="League"]'
          ];
          
          for (const selector of tournamentSelectors) {
            const tournamentEl = $(card).find(selector).first();
            if (tournamentEl.length) {
              // Remover "Reveja os lances" e textos similares
              tournament = tournamentEl.text().split(/Reveja|Assistir|Watch/)[0].trim();
              break;
            }
          }
          
          // Construir objeto de partida
          const match = {
            date: currentDate,
            time, 
            tournament,
            teamA,
            teamB,
            scoreA: scoreA || '0',
            scoreB: scoreB || '0'
          };
          
          // Adicionar à lista de partidas
          matches.push(match);
          logger.debug(`Partida extraída: ${teamA} vs ${teamB} (${scoreA}x${scoreB})`);
        });
      });
    }
  });
  
  return matches;
}

module.exports = {
  extractMatches
};