const { v4: uuidv4 } = require('uuid');
const scrapingService = require('./scrapingService');
const logger = require('../utils/logger');

class BotService {
  constructor() {
    // Inicializar o serviço de scraping com conexão ao MongoDB
    scrapingService.init()
      .then(() => logger.info('Serviço de scraping inicializado'))
      .catch(err => logger.error(`Erro ao inicializar scraping: ${err.message}`));
  }
  
  // Obter árvore de diálogo atualizada
  getDialogTree() {
    return scrapingService.getDialogTree();
  }

  // Iniciar conversa - agora apenas retorna a mensagem inicial
  async getInitialMessage() {
    try {
      logger.info('Solicitando mensagem inicial');
      const dialogTree = this.getDialogTree();
      
      if (!dialogTree || !dialogTree.initial) {
        throw new Error('Árvore de diálogo incompleta ou inválida');
      }
      
      // Criar mensagem inicial do bot
      const initialMessage = {
        _id: uuidv4(),
        content: dialogTree.initial.content,
        sender: 'bot',
        isBot: true,
        suggestedResponses: dialogTree.initial.suggestedResponses.map(text => ({ text })),
        timestamp: new Date().toISOString()
      };

      return initialMessage;
    } catch (error) {
      logger.error(`Erro ao obter mensagem inicial: ${error.message}`);
      throw error;
    }
  }

  // Processar mensagem - agora aceita o estado atual e retorna apenas a próxima resposta
  async processMessage(currentState, messageContent) {
    try {
      const dialogTree = this.getDialogTree();
      
      if (!currentState) {
        currentState = 'initial';
      }
      
      // Criar mensagem do usuário com ID para o frontend
      const userMessage = {
        _id: uuidv4(),
        content: messageContent,
        sender: 'user',
        isBot: false,
        timestamp: new Date().toISOString()
      };
      
      // Detectar intenção e próximo estado
      const nextState = this.detectIntent(messageContent, currentState, dialogTree);
      
      // Determinar resposta do bot
      let botResponse;
      let responseState = currentState;
      
      if (nextState.startsWith('help_')) {
        botResponse = {
          _id: uuidv4(),
          content: `Desculpe, não entendi o que você quis dizer. Aqui estão algumas opções para continuarmos:`,
          sender: 'bot',
          isBot: true,
          suggestedResponses: dialogTree[currentState].suggestedResponses.map(text => ({ text })),
          timestamp: new Date().toISOString()
        };
      } else {
        botResponse = {
          _id: uuidv4(),
          content: dialogTree[nextState].content,
          sender: 'bot',
          isBot: true,
          suggestedResponses: dialogTree[nextState].suggestedResponses.map(text => ({ text })),
          timestamp: new Date().toISOString()
        };
        
        // Atualizar estado
        responseState = nextState;
      }

      return {
        userMessage,
        botResponse,
        nextState: responseState
      };
    } catch (error) {
      logger.error(`Erro ao processar mensagem: ${error.message}`);
      throw error;
    }
  }

  // Detectar intenção com base na mensagem do usuário
  detectIntent(message, currentState, dialogTree) {
    const lowerMessage = message.toLowerCase();
    
    // Verificar se o estado atual existe na árvore de diálogo
    if (!dialogTree[currentState]) {
      logger.warn(`Estado "${currentState}" não encontrado na árvore de diálogo. Usando estado inicial.`);
      currentState = 'initial';
    }
    
    const stateIntents = dialogTree[currentState].intents;
    
    // Verificar correspondências nas intenções definidas
    for (const [intent, keywords] of Object.entries(stateIntents)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          logger.debug(`Intenção detectada: ${intent} a partir da palavra-chave: ${keyword}`);
          return intent;
        }
      }
    }
    
// Verificações para perguntas gerais independente do estado atual
const globalIntents = {
  // Estado para todas opções
  all_options: ["todas opções", "todas as opções", "todos os tópicos", "menu completo", "ver tudo", "mostrar tudo", "opções", "ajuda", "o que você sabe", "do que podemos falar", "o que você pode fazer", "quais são os assuntos"],
  
  // Estados básicos
  next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda", "próxima live", "quando tem jogo", "joga quando", "data jogo", "quando é o jogo"],
  current_lineup: ["escalação", "jogadores", "elenco", "time atual", "roster", "quem joga", "lineup", "formação atual", "quinteto", "equipe atual", "jogadores atuais"],
  match_history: ["resultados recentes", "histórico", "partidas anteriores", "últimos jogos", "últimas partidas", "como foi", "desempenho recente", "como jogou", "últimos mapas", "resultados"],
  about_furia: ["sobre a furia", "história", "organização", "quem é a furia", "informações", "surgiu", "fundação", "origem", "quando começou", "como surgiu", "história do time"],
  world_ranking: ["ranking", "posição mundial", "hltv", "classificação", "top mundial", "melhor do mundo", "colocação", "posição no ranking", "entre os melhores", "ranking hltv"],
  
  
  // Estados de conquistas e valores
  achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos", "torneios", "prêmios", "campanhas", "sucesso", "venceu", "ganhou"],
  furia_values: ["valores", "filosofia", "missão", "visão", "cultura", "princípios", "ideais", "o que representa", "significa", "essência", "identidade"],
  
  // Informações sobre jogadores
  player_info: ["informações dos jogadores", "detalhes", "sobre os jogadores", "perfil", "bio", "biografia", "roles", "funções", "cada jogador", "personagens"],
  star_player: ["jogador destaque", "melhor jogador", "estrela", "destaque", "mvp", "craque", "ás", "talento", "jogador principal", "carry"],
  individual_stats: ["estatísticas individuais", "números", "performance", "kda", "rating", "stats", "desempenho individual", "dados", "médias", "kd", "kills"],
  
  // Estatísticas e informações do time
  team_stats: ["estatísticas do time", "desempenho", "números", "dados", "porcentagens", "taxa de vitória", "estatísticas", "winrate", "performance coletiva"],
  best_maps: ["melhores mapas", "map pool", "preferidos", "estatísticas de mapas", "mapas fortes", "bons mapas", "mapas favoritos", "especialidade", "mapa mais forte"],
  team_history: ["história do time", "trajetória", "jornada", "evolução", "passado", "começo", "caminho", "desenvolvimento", "crescimento", "percurso"],
  timeline: ["linha do tempo", "cronologia", "evolução", "anos", "datas", "momentos", "marcos", "história ano a ano", "trajetória completa", "histórico"],
  
  // Competições e rivalidades
  main_competitors: ["competidores", "rivais", "adversários", "concorrentes", "outros times", "inimigos", "oponentes", "times rivais", "concorrência", "competição"],
  historical_rivalry: ["rivalidade", "clássicos", "confrontos históricos", "derbys", "jogos clássicos", "maiores rivais", "duelo", "enfrentamentos", "embates"],
  upcoming_tournaments: ["próximos torneios", "campeonatos", "competições", "eventos", "agenda de torneios", "próximas competições", "campeonatos futuros", "qual torneio"],
  tournament_history: ["histórico de torneios", "torneios passados", "competições anteriores", "performance em campeonatos", "campeonatos passados", "torneios disputados"],
  memorable_matches: ["confrontos", "partidas", "jogos", "memoráveis", "importantes", "grandes jogos", "jogos históricos", "partidas lendárias", "melhor jogo"],
  
  // Engajamento e suporte
  faq: ["perguntas frequentes", "faq", "dúvidas comuns", "perguntas", "ajuda", "suporte", "queria saber", "como funciona", "me explica", "tenho uma dúvida"],
  support_team: ["apoiar", "torcedor", "fã", "comprar", "loja", "produtos", "como ajudar", "dar suporte", "torcer", "contribuir"],
  watch_games: ["assistir", "onde ver", "transmissão", "stream", "ao vivo", "canal", "acompanhar jogos", "onde assisto", "como assistir", "onde passa"],
  social_media: ["redes sociais", "twitter", "instagram", "youtube", "twitch", "facebook", "tiktok", "seguir", "perfil oficial", "canal", "online"],
  official_store: ["loja oficial", "produtos", "comprar", "camiseta", "mercadoria", "loja", "merch", "compras", "uniformes", "itens oficiais", "gear"],
  official_channel: ["canal oficial", "twitch", "furiatv", "streaming", "transmissões oficiais", "live", "onde assistir", "canal da furia", "tv furia"]
};
    
    for (const [intent, keywords] of Object.entries(globalIntents)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          logger.debug(`Intenção global detectada: ${intent} a partir da palavra-chave: ${keyword}`);
          return intent;
        }
      }
    }
    
    // Verificação de saudações e perguntas de cumprimento
    const greetings = ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "e aí", "eai", "tudo bem"];
    for (const greeting of greetings) {
      if (lowerMessage.includes(greeting)) {
        logger.debug(`Saudação detectada. Retornando ao estado inicial.`);
        return "initial";
      }
    }
    
    // Se não encontrar correspondência, sugerir opções do estado atual
    logger.debug(`Nenhuma intenção detectada para a mensagem: "${lowerMessage}"`);
    return 'help_' + currentState;
  }
}

module.exports = new BotService();