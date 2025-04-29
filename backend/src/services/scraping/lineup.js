const logger = require('../../utils/logger');

// Extrair jogadores e staff
async function extractLineup($) {
  const titular = [];
  const substitute = [];
  const staff = [];
  let foundAnyPlayers = false;
  
  // Buscar jogadores por seção
  $('[class*="PlayerCardList"]').each((i, section) => {
    // Determinar tipo da seção
    const prevHeading = $(section).prevAll('h2, h3').first().text().toLowerCase();
    let sectionType = determineSectionType(prevHeading, i);
    
    // Coletar jogadores
    $(section).find('[class*="PlayerNickName"], [class*="player-name"]').each((j, player) => {
      const name = $(player).text().trim();
      if (!name) return;
      
      foundAnyPlayers = true;
      addPlayerToSection(name, sectionType, titular, substitute, staff);
    });
  });
  
  return { titular, substitute, staff, foundAnyPlayers };
}

// Determinar o tipo de seção (titular, reserva, staff)
function determineSectionType(heading, index) {
  if (heading.includes('titular') || heading.includes('line')) {
    return 'titular';
  } else if (heading.includes('reserva') || heading.includes('substitute')) {
    return 'reserva';
  } else if (heading.includes('técnic') || heading.includes('coach') || heading.includes('staff')) {
    return 'staff';
  } else if (index === 0) {
    return 'titular';
  }
  return '';
}

// Adicionar jogador à seção apropriada
function addPlayerToSection(name, sectionType, titular, substitute, staff) {
  if (sectionType === 'titular') {
    titular.push(name);
  } else if (sectionType === 'reserva') {
    substitute.push(name);
  } else if (sectionType === 'staff') {
    staff.push(name);
  } else {
    titular.push(name); // Fallback para titular
  }
}

module.exports = {
  extractLineup,
  determineSectionType,
  addPlayerToSection
};