const DialogTree = require('../../models/DialogTree');
const logger = require('../../utils/logger');

// Carregar árvore de diálogo do MongoDB
async function loadFromDatabase() {
  try {
    // Buscar árvore principal ou criar se não existir
    let dialogTree = await DialogTree.findOne({ treeId: 'main' });
    
    if (dialogTree) {
      logger.info('Árvore de diálogo carregada do MongoDB');
      return dialogTree.nodes;
    } else {
      logger.warn('Árvore de diálogo não encontrada no MongoDB');
      return null;
    }
  } catch (error) {
    logger.error(`Erro ao carregar árvore de diálogo: ${error.message}`);
    return null;
  }
}

// Salvar árvore de diálogo no MongoDB
async function saveToDatabase(dialogTreeNodes) {
  try {
    // Atualizar ou criar novo documento
    const result = await DialogTree.findOneAndUpdate(
      { treeId: 'main' },
      { 
        nodes: dialogTreeNodes,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true 
      }
    );
    
    logger.info('Árvore de diálogo salva no MongoDB');
    return true;
  } catch (error) {
    logger.error(`Erro ao salvar árvore de diálogo: ${error.message}`);
    return false;
  }
}

// Garantir que nó de diálogo exista
function ensureNode(dialogTree, nodeKey, defaultOptions) {
  if (!dialogTree) dialogTree = getDefaultTree();
  if (!dialogTree[nodeKey]) {
    dialogTree[nodeKey] = {
      content: "",
      suggestedResponses: defaultOptions.suggestedResponses || [],
      intents: defaultOptions.intents || {}
    };
  }
}

// Obter árvore de diálogo padrão
function getDefaultTree() {
  return {
    initial: {
      content: "SALVE, FURIOSO! Panthera à teu dispor! Em que posso te ajudar? Se quiser ver tudo que sei, é só me pedir o 'menu'!",
      suggestedResponses: [
        "Próximo jogo",
        "Escalação atual", 
        "Resultados recentes",
        "Sobre a FURIA",
        "Perguntas frequentes"
      ],
      intents: {
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda", "próxima live", "quando tem jogo", "joga quando", "data jogo", "quando é o jogo"],
        current_lineup: ["escalação", "jogadores", "elenco", "time atual", "roster", "quem joga", "lineup", "formação atual", "quinteto", "equipe atual", "jogadores atuais"],
        match_history: ["resultados recentes", "histórico", "partidas anteriores", "últimos jogos", "últimas partidas", "como foi", "desempenho recente", "como jogou", "últimos mapas", "resultados"],
        about_furia: ["sobre a furia", "história", "organização", "quem é a furia", "informações", "surgiu", "fundação", "origem", "quando começou", "como surgiu", "história do time"],
        faq: ["perguntas frequentes", "faq", "dúvidas comuns", "perguntas", "ajuda", "suporte", "queria saber", "como funciona", "me explica", "tenho uma dúvida"]
      }
    },
    
    next_game: {
      content: "Poxa, não consegui pegar as infos do próximo jogo 😓 Mas fica ligado nas redes! Nossos monstros logo logo entram em ação! #VAMOFURIA",
      suggestedResponses: ["Escalação atual", "Resultados recentes", "Voltar ao início"],
      intents: {
        current_lineup: ["escalação", "jogadores", "elenco", "time atual", "roster", "quem joga", "lineup", "formação atual"],
        match_history: ["resultados recentes", "histórico", "partidas anteriores", "últimos jogos", "últimas partidas"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    current_lineup: {
      content: "ESQUADRÃO DE GUERRA DA FURIA CS2: Molodão, YEKINDAR (o latviano insano!), o Professor FalleN, o monstro do KS e nosso yuurih! 🔥 QUE LINEUP ABSURDA! #DIADEFURIA",
      suggestedResponses: ["Próximo jogo", "Informações dos jogadores", "Voltar ao início"],
      intents: {
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda"],
        player_info: ["informações", "detalhes", "jogadores", "stats", "estatísticas", "sobre os jogadores"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    match_history: {
      content: "Ahhh, não consegui buscar os resultados mais recentes 😅 Mas relaxa que nosso timaço vem jogando muito! Volta aí depois pra conferir os resultados! #DIADEFURIA",
      suggestedResponses: ["Próximo jogo", "Estatísticas do time", "Voltar ao início"],
      intents: {
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda"],
        team_stats: ["estatísticas", "desempenho", "números", "dados", "porcentagens", "taxa de vitória"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    about_furia: {
      content: "A FURIA é NOSSA PAIXÃO! 🔥 Fundada em 2017 pelos visionários Jaime e Chucho, começamos a DOMINAR o cenário de CS logo de cara! Hoje somos uma potência em vários jogos: CS2, LOL, VALORANT e Free Fire! Nossa marca é o #DIADEFURIA, grito de guerra que ecoa em cada vitória! SOMOS FURIOSOS, SOMOS FAMÍLIA!",
      suggestedResponses: ["Conquistas", "Escalação atual", "Valores da FURIA", "Voltar ao início"],
      intents: {
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos", "torneios", "prêmios"],
        current_lineup: ["escalação", "jogadores", "elenco", "time atual", "roster", "quem joga"],
        furia_values: ["valores", "filosofia", "missão", "visão", "cultura", "princípios", "ideais"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    world_ranking: {
      content: "NOSSA FURIA tá VOANDO no ranking mundial! 🚀 Estamos no TOP das melhores do mundo, e só subindo! Com a chegada do Professor FalleN e do monstro YEKINDAR, é só questão de tempo até a gente DOMINAR o TOP 5! HLTV QUE NOS AGUARDE! #DIADEFURIA",
      suggestedResponses: ["Competidores principais", "Próximo jogo", "Voltar ao início"],
      intents: {
        main_competitors: ["competidores", "rivais", "adversários", "concorrentes", "outros times", "inimigos", "oponentes"],
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    achievements: {
      content: "CONQUISTAS? TEMOS VÁRIAS! 🏆 Vice na ESL Pro League S16, TOP 4 no IEM Rio Major (QUE CAMPANHA ÉPICA!), CAMPEÕES na ESEA S32, e muito mais! Nossos monstros sempre dão show e representam o Brasil no TOPO! E isso é só o começo, vem muito mais por aí! #VAMOFURIA",
      suggestedResponses: ["Jogador destaque", "Sobre a FURIA", "Voltar ao início"],
      intents: {
        star_player: ["jogador destaque", "melhor jogador", "estrela", "destaque", "mvp", "craque", "ás", "talento"],
        about_furia: ["sobre", "história", "organização", "quem é a furia", "informações"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    furia_values: {
      content: "A FURIA não é só um time, é UM ESTILO DE VIDA! 🔥 Paixão, garra, disciplina e trabalho MONSTRO são nossos valores! Não estamos aqui só pra ganhar (mas a gente GANHA MUITO), estamos pra inspirar toda a comunidade BR e mostrar que o Brasil DOMINA no cenário mundial! #DIADEFURIA",
      suggestedResponses: ["Responsabilidade social", "Conquistas", "Voltar ao início"],
      intents: {
        social_responsibility: ["responsabilidade social", "iniciativas", "projetos sociais", "comunidade", "ações"],
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    player_info: {
      content: "ESQUADRÃO DE ESTRELAS! KS é uma MÁQUINA de headshots e consistência! yuurih é BRABO em qualquer função! O Professor FalleN traz aquela experiência ABSURDA e o melhor IGL do Brasil! YEKINDAR é um MONSTRO de entry que destrói qualquer defesa! E o Molodão complementa com um talento INSANO! NÃO TEM PRA NINGUÉM! 🔥",
      suggestedResponses: ["Estatísticas individuais", "História do time", "Voltar ao início"],
      intents: {
        individual_stats: ["estatísticas individuais", "números", "performance", "kda", "rating", "stats", "médias", "kd"],
        team_history: ["história do time", "trajetória", "jornada", "evolução", "passado", "começo"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    team_stats: {
      content: "Nosso time tá DEMOLINDO! 🔥 Somos MONSTROS em Inferno e Ancient! Nosso CT é BRABO e com o Professor FalleN chamando as estratégias, não tem pra ninguém! É só respeitar o #DIADEFURIA!",
      suggestedResponses: ["Melhores mapas", "Próximos torneios", "Voltar ao início"],
      intents: {
        best_maps: ["melhores mapas", "map pool", "preferidos", "estatísticas de mapas", "mapas fortes", "bons mapas"],
        upcoming_tournaments: ["próximos torneios", "campeonatos", "competições", "eventos", "agenda de torneios"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    main_competitors: {
      content: "Competidores? Todos TREMEM quando enfrentam a FURIA! 🔥 Vitality, NAVI, G2, FaZe e Liquid estão sempre no nosso caminho, mas NINGUÉM nos assusta! No Brasil, MIBR, paiN e INTZ são rivais históricos, mas a FURIA sempre mostra quem manda! #VAMOFURIA",
      suggestedResponses: ["Rivalidade histórica", "Ranking mundial", "Voltar ao início"],
      intents: {
        historical_rivalry: ["rivalidade", "clássicos", "confrontos históricos", "derbys", "jogos clássicos", "maiores rivais"],
        world_ranking: ["ranking mundial", "classificação", "posição", "top mundial", "melhor do mundo"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    star_player: {
      content: "KS é o MONSTRO mais consistente que temos há anos! SEGURA ESSE HOMEM! 🔥 Mas agora com YEKINDAR e o Professor FalleN, nosso time tá ABSURDO de estrelas! O yuurih então? JOGA DEMAIS EM QUALQUER POSIÇÃO! São tantos craques que nem dá pra escolher! #DIADEFURIA",
      suggestedResponses: ["Estatísticas individuais", "Escalação completa", "Voltar ao início"],
      intents: {
        individual_stats: ["estatísticas", "números", "performance", "rating", "stats", "médias", "kd"],
        current_lineup: ["escalação", "time completo", "jogadores", "elenco", "roster"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    social_responsibility: {
      content: "A FURIA não é só vitórias dentro do servidor! 🔥 Nosso time ABRAÇA a comunidade, faz doações, apoia a inclusão digital e ajuda a revelar talentos das quebradas! É por isso que somos mais que um time, somos uma FAMÍLIA que transforma vidas através dos games! #DIADEFURIAÉBEM+",
      suggestedResponses: ["Valores da FURIA", "Sobre a organização", "Voltar ao início"],
      intents: {
        furia_values: ["valores", "filosofia", "missão", "visão", "cultura", "princípios"],
        about_furia: ["sobre", "organização", "história", "quem é a furia"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    individual_stats: {
      content: "STATS DOS MONSTROS? 🔥 KS com rating ABSURDO acima de 1.20! yuurih e YEKINDAR DOMINANDO as aberturas de round! E o Professor FalleN transformando nosso jogo tático! É MUITO TALENTO JUNTO! Não tem estatística que aguente! #VAMOFURIA",
      suggestedResponses: ["Equipe completa", "Conquistas", "Voltar ao início"],
      intents: {
        current_lineup: ["equipe", "jogadores", "escalação", "time atual", "roster", "formação"],
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    team_history: {
      content: "NOSSA HISTÓRIA É ÉPICA! 🔥 Começamos em 2017, mas em 2019 já EXPLODIMOS no cenário mundial com aquele jogo AGRESSIVO E ÚNICO que assustava todo mundo! Em 2023, o PROFESSOR FalleN chegou pra revolucionar, e em 2024, com YEKINDAR, viramos MÁQUINA DE GUERRA internacional! QUE TRAJETÓRIA, MANO! #DIADEFURIA",
      suggestedResponses: ["Linha do tempo", "Conquistas", "Voltar ao início"],
      intents: {
        timeline: ["linha do tempo", "cronologia", "evolução", "anos", "datas", "momentos", "marcos"],
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    best_maps: {
      content: "Nosso map pool é SINISTRO! 🔥 DOMINAMOS Inferno e Ancient com mais de 70% de vitórias! BRABO DEMAIS! Nuke e Mirage também são NOSSOS! E com o Professor FalleN, nossa pool só expande! É #DIADEFURIA em QUALQUER MAPA!",
      suggestedResponses: ["Estatísticas do time", "Jogador destaque", "Voltar ao início"],
      intents: {
        team_stats: ["estatísticas", "performance", "time", "desempenho", "números", "taxa de vitória"],
        star_player: ["jogador destaque", "melhor jogador", "estrela", "destaque", "mvp"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    upcoming_tournaments: {
      content: "JÁ PREPARA A TORCIDA! 🔥 A FURIA vai INVADIR os maiores torneios do mundo: ESL Pro League, BLAST Premier e vamos DESTRUIR nas classificatórias pro Major! Nosso objetivo? DOMINAR a elite mundial e erguer TODOS OS TROFÉUS! #DIADEFURIA",
      suggestedResponses: ["Próximo jogo", "Histórico de torneios", "Voltar ao início"],
      intents: {
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda"],
        tournament_history: ["histórico", "torneios passados", "competições anteriores", "campanhas", "campeonatos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    historical_rivalry: {
      content: "Rivalidades ÉPICAS! 🔥 Contra Liquid e MIBR são sempre FOGO! Quando é FURIA x MIBR então? O BRASIL PARA pra assistir! Contra a Liquid é sempre batalha de GIGANTES nas Américas! É sempre dia de dar o SANGUE nessas partidas! #VAMOFURIA",
      suggestedResponses: ["Confrontos memoráveis", "Principais competidores", "Voltar ao início"],
      intents: {
        memorable_matches: ["confrontos", "partidas", "jogos", "memoráveis", "importantes", "históricos", "lendárias"],
        main_competitors: ["competidores", "rivais", "adversários", "concorrentes", "outros times", "inimigos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    timeline: {
      content: "NOSSA JORNADA MONSTRO: 2017 - Fundação da nossa casa! 2018 - Primeiro esquadrão no CS! 2019 - EXPLODIMOS no cenário com TOP8 no Major! 2020 - DOMINANDO entre as melhores do mundo! 2022 - CENA ÉPICA no TOP4 do IEM Rio! 2023 - O PROFESSOR FalleN chega! 2024 - YEKINDAR se junta e é SÓ VITÓRIA! 🔥 #DIADEFURIA",
      suggestedResponses: ["História completa", "Conquistas", "Voltar ao início"],
      intents: {
        team_history: ["história completa", "detalhes", "trajetória", "jornada", "evolução", "passado"],
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    tournament_history: {
      content: "JÁ COLOCAMOS MEDO em todos os grandes torneios! 🔥 Majors, ESL, BLAST, IEM - a FURIA tá em TODAS! Momento INESQUECÍVEL foi o TOP4 no IEM Rio 2022, com a TORCIDA BRASILEIRA EXPLODINDO! Na ESL Pro League S16 também MOSTRAMOS NOSSA FORÇA! NINGUÉM DORME CONTRA A FURIA! #VAMOFURIA",      
      suggestedResponses: ["Conquistas", "Próximos torneios", "Voltar ao início"],
      intents: {
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        upcoming_tournaments: ["próximos torneios", "agenda", "calendário", "competições futuras"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    memorable_matches: {
      content: "PARTIDAS HISTÓRICAS? TEMOS VÁRIAS! 🔥 Aquela DEMOLIÇÃO contra Astralis em 2019, quando eles eram IMBATÍVEIS! Os CLÁSSICOS contra Liquid que PARAM AS AMÉRICAS! E claro, a campanha LENDÁRIA no IEM Rio, especialmente aquele JOGAÇO contra NAVI! MOMENTOS QUE FICAM NA MEMÓRIA DE TODO FURIOSO! #DIADEFURIA",
      suggestedResponses: ["Rivalidades históricas", "Estatísticas do time", "Voltar ao início"],
      intents: {
        historical_rivalry: ["rivalidades", "história", "adversários", "clássicos", "confrontos históricos"],
        team_stats: ["estatísticas", "performance", "números", "desempenho", "taxa de vitória"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },

    faq: {
      content: "Perguntas frequentes sobre a NOSSA FURIA! 🔥 Manda ver no que você quer saber ou escolhe uma opção aí embaixo! #DIADEFURIA",
      suggestedResponses: ["Como apoiar a FURIA?", "Onde assistir jogos?", "Redes sociais", "Voltar ao início"],
      intents: {
        support_team: ["apoiar", "torcedor", "fã", "comprar", "loja", "produtos", "como ajudar"],
        watch_games: ["assistir", "onde ver", "transmissão", "stream", "ao vivo", "canal", "onde assistir"],
        social_media: ["redes sociais", "twitter", "instagram", "youtube", "twitch", "seguir"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    support_team: {
      content: "COMO APOIAR NOSSO ESQUADRÃO? 🔥 Cola na loja (https://furia.gg) e garante seu kit de guerra oficial! Assiste todas as partidas e FAZ BARULHO! Segue nas redes e interage MUITO! Ou vira membro na Twitch! Todo apoio faz a FURIA ainda mais FORTE! #VAMOFURIA",
      suggestedResponses: ["Loja oficial", "Redes sociais", "Voltar ao início"],
      intents: {
        official_store: ["loja", "produtos", "comprar", "camiseta", "mercadoria", "merch", "uniformes"],
        social_media: ["redes sociais", "seguir", "twitter", "instagram", "youtube", "twitch"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    watch_games: {
      content: "PRA ASSISTIR AOS MONSTROS EM AÇÃO é só colar na Twitch (https://twitch.tv/furiatv)! 🔥 Também tem as transmissões oficiais da BLAST, ESL, PGL e outros campeonatos! Não perde um minuto da nossa FURIA DESTRUINDO! #DIADEFURIA",
      suggestedResponses: ["Canal oficial", "Próximo jogo", "Voltar ao início"],
      intents: {
        official_channel: ["canal", "oficial", "twitch", "furiatv", "streaming", "transmissões", "live"],
        next_game: ["próximo", "jogo", "partida", "quando joga", "calendário", "agenda"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    social_media: {
      content: "COLA COM A GENTE NAS REDES! 🔥 Twitter/X: @FURIA, Instagram: @furiagg, Twitch: furiatv, TikTok: @furiagg! Segue lá e fica ligado em todas as novidades da NOSSA FURIA! #VAMOFURIA",
      suggestedResponses: ["Como apoiar", "Sobre a FURIA", "Voltar ao início"],
      intents: {
        support_team: ["apoiar", "ajudar", "torcedor", "comprar", "loja", "produtos", "como ajudar"],
        about_furia: ["sobre", "história", "organização", "quem é a furia", "informações"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },

    official_store: {
      content: "A LOJA MAIS BRABA tá no https://furia.gg ! 🔥 Camisetas INSANAS, moletons ESTILOSOS, bonés e muito mais com a nossa marca! Qualidade ABSURDA e você ainda ajuda diretamente o time! BORA VESTIR AS CORES DA FURIA! #DIADEFURIA",
      suggestedResponses: ["Como apoiar", "Redes sociais", "Voltar ao início"],
      intents: {
        support_team: ["apoiar", "formas", "ajudar", "torcedor", "fã", "contribuir"],
        social_media: ["redes sociais", "seguir", "mídias", "twitter", "instagram"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
    
    official_channel: {
      content: "CANAL OFICIAL? https://twitch.tv/furiatv ! 🔥 Lá tem TUDO: jogos AO VIVO, bastidores EXCLUSIVOS, conteúdo com nossos MONSTROS! Os players também streamam nos canais pessoais! Cola lá e não perde NADA da nossa FURIA! #VAMOFURIA",
      suggestedResponses: ["Onde assistir jogos", "Redes sociais", "Voltar ao início"],
      intents: {
        watch_games: ["assistir", "transmissão", "jogos", "onde ver", "ao vivo", "como assistir", "onde assistir"],
        social_media: ["redes sociais", "seguir", "mídias", "twitter", "instagram"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },

    all_options: {
      content: "TODAS AS OPÇÕES DISPONÍVEIS PARA VOCÊ, FURIOSO! 🔥\n\n" +
               "📊 INFORMAÇÕES GERAIS\n" +
               "• Próximo jogo\n" + 
               "• Escalação atual\n" + 
               "• Resultados recentes\n" +
               "• Sobre a FURIA\n" +
               "• Ranking mundial\n\n" +
               
               "🏆 CONQUISTAS E HISTÓRIA\n" +
               "• Conquistas\n" +
               "• Valores da FURIA\n" +
               "• História do time\n" +
               "• Linha do tempo\n\n" +
               
               "👥 JOGADORES\n" +
               "• Informações dos jogadores\n" +
               "• Jogador destaque\n" +
               "• Estatísticas individuais\n\n" +
               
               "📈 DESEMPENHO E ESTATÍSTICAS\n" +
               "• Estatísticas do time\n" +
               "• Melhores mapas\n\n" +
               
               "🥊 COMPETIÇÕES\n" +
               "• Competidores principais\n" +
               "• Rivalidade histórica\n" +
               "• Próximos torneios\n" +
               "• Histórico de torneios\n" +
               "• Partidas memoráveis\n\n" +
               
               "❤️ SUPORTE E COMUNIDADE\n" +
               "• Como apoiar a FURIA\n" +
               "• Onde assistir jogos\n" +
               "• Redes sociais\n" +
               "• Loja oficial\n" +
               "• Perguntas frequentes",
      suggestedResponses: [],
      intents: {
        next_game: ["próximo jogo", "próxima partida", "quando joga", "calendário", "agenda"],
        current_lineup: ["escalação", "jogadores", "elenco", "time atual", "roster", "quem joga"],
        match_history: ["resultados recentes", "histórico", "partidas anteriores", "últimos jogos"],
        about_furia: ["sobre a furia", "história", "organização", "quem é a furia", "informações"],
        world_ranking: ["ranking", "posição mundial", "hltv", "classificação", "top mundial"],
        achievements: ["conquistas", "títulos", "troféus", "vitórias", "campeonatos"],
        furia_values: ["valores", "filosofia", "missão", "visão", "cultura", "princípios"],
        player_info: ["informações", "detalhes", "jogadores", "stats", "estatísticas", "sobre jogadores"],
        star_player: ["jogador destaque", "melhor jogador", "estrela", "mvp", "craque"],
        individual_stats: ["estatísticas individuais", "números", "performance", "kda", "rating", "stats"],
        team_stats: ["estatísticas", "desempenho", "números", "dados", "porcentagens", "taxa de vitória"],
        best_maps: ["melhores mapas", "map pool", "preferidos", "estatísticas de mapas", "mapas fortes"],
        team_history: ["história do time", "trajetória", "jornada", "evolução", "passado", "começo"],
        timeline: ["linha do tempo", "cronologia", "evolução", "anos", "datas", "momentos", "marcos"],
        main_competitors: ["competidores", "rivais", "adversários", "concorrentes", "outros times"],
        historical_rivalry: ["rivalidade", "clássicos", "confrontos históricos", "derbys", "jogos clássicos"],
        upcoming_tournaments: ["próximos torneios", "campeonatos", "competições", "eventos", "agenda"],
        tournament_history: ["histórico", "torneios passados", "competições anteriores", "campanhas"],
        memorable_matches: ["confrontos", "partidas", "jogos", "memoráveis", "importantes", "históricos"],
        support_team: ["apoiar", "torcedor", "fã", "comprar", "loja", "produtos", "como ajudar"],
        watch_games: ["assistir", "onde ver", "transmissão", "stream", "ao vivo", "canal", "onde assistir"],
        social_media: ["redes sociais", "twitter", "instagram", "youtube", "twitch", "seguir"],
        official_store: ["loja", "produtos", "comprar", "camiseta", "mercadoria", "merch", "uniformes"],
        faq: ["perguntas frequentes", "faq", "dúvidas comuns", "perguntas", "ajuda", "suporte"],
        initial: ["voltar", "início", "home", "começar de novo"]
      }
    },
  };
}

module.exports = {
  loadFromDatabase,
  saveToDatabase,
  getDefaultTree,
  ensureNode
};