const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const logger = require('../utils/logger');
const dialogTreeManager = require('./scraping/dialogTree');
const matchExtractor = require('./scraping/matches');
const lineupExtractor = require('./scraping/lineup');
const formatters = require('./scraping/formatters');

class ScrapingService {
  constructor() {
    this.dialogTree = null;
    this.baseUrl = 'https://draft5.gg/equipe/330-FURIA';
    this.teamName = 'FURIA';
  }

  // Inicializar o serviço
  async init() {
    try {
      // Tentar carregar dados do MongoDB
      this.dialogTree = await dialogTreeManager.loadFromDatabase();
      
      // Se não houver dados, criar estrutura padrão
      if (!this.dialogTree) {
        this.dialogTree = dialogTreeManager.getDefaultTree();
        await dialogTreeManager.saveToDatabase(this.dialogTree);
      }
      
      // Atualizar dados na inicialização
      this.updateData().catch(err => 
        logger.warn(`Falha na atualização inicial de dados: ${err.message}`)
      );
      
      return this.dialogTree;
    } catch (error) {
      logger.error(`Erro ao inicializar serviço de scraping: ${error.message}`);
      this.dialogTree = dialogTreeManager.getDefaultTree();
      return this.dialogTree;
    }
  }

  // Atualizar dados via scraping com Puppeteer
  async updateData() {
    let browser = null;
    try {
      logger.info('Iniciando atualização de dados via scraping');
      
      // Verificar se this.dialogTree existe
      if (!this.dialogTree) {
        this.dialogTree = dialogTreeManager.getDefaultTree();
      }

      // Configuração e navegação
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1366, height: 768 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0');
      
      logger.info(`Acessando ${this.baseUrl}`);
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('body', { timeout: 10000 });

      // Extrair e processar o conteúdo
      const content = await page.content();
      const $ = cheerio.load(content);
      
      // Executar extrações em paralelo para maior eficiência
      await Promise.all([
        this.updateNextMatch($),
        this.updateLineup($),
        this.updateMatchHistory($)
      ]);
      
      // Salvar dados no MongoDB
      await dialogTreeManager.saveToDatabase(this.dialogTree);
      logger.info('Dados atualizados com sucesso no MongoDB');
      return true;
    } catch (error) {
      logger.error(`Erro na atualização de dados: ${error.message}`);
      return false;
    } finally {
      if (browser) {
        await browser.close().catch(e => logger.error(`Erro ao fechar browser: ${e.message}`));
      }
    }
  }


  // Atualizar informação do próximo jogo
  async updateNextMatch($) {
    try {
      // Inicializar estrutura se necessário
      dialogTreeManager.ensureNode(this.dialogTree, 'next_game', {
        suggestedResponses: ["Voltar ao início", "Ver escalação"],
        intents: {
          initial: ["voltar", "início", "menu principal"],
          current_lineup: ["escalação", "jogadores", "elenco"]
        }
      });

      logger.info('Buscando próximo jogo');
      
      // Extrair partidas futuras
      const upcomingMatches = await matchExtractor.extractMatches($, true, this.teamName);
      
      // Atualizar conteúdo
      if (upcomingMatches.length > 0) {
        this.dialogTree.next_game.content = formatters.formatNextMatch(upcomingMatches[0], this.teamName);
        logger.info(`Próximo jogo atualizado`);
      } else {
        this.dialogTree.next_game.content = `Sem jogos próximos. Não veremos a ${this.teamName} jogar por enquanto...`;
        logger.warn('Próximo jogo não encontrado');
      }
    } catch (error) {
      formatters.handleUpdateError(this.dialogTree, 'next_game', `Erro no próximo jogo: ${error.message}`, this.teamName);
    }
  }

  // Atualizar histórico de partidas
  async updateMatchHistory($) {
    try {
      // Inicializar estrutura se necessário
      dialogTreeManager.ensureNode(this.dialogTree, 'match_history', {
        suggestedResponses: ["Próximo jogo", "Escalação atual", "Voltar ao início"],
        intents: {
          next_game: ["próximo jogo", "próxima partida"],
          current_lineup: ["escalação", "jogadores", "elenco"],
          initial: ["voltar", "início", "menu principal"]
        }
      });

      logger.info('Atualizando histórico');
      
      // Extrair partidas passadas
      const pastMatches = await matchExtractor.extractMatches($, false, this.teamName);
      
      // Formatar resposta
      if (pastMatches.length > 0) {
        this.dialogTree.match_history.content = formatters.formatMatchHistory(pastMatches, this.teamName);
        logger.info(`Histórico: ${pastMatches.length} partidas`);
      } else {
        this.dialogTree.match_history.content = `Não consegui encontrar os resultados recentes das partidas da ${this.teamName}. Por favor, consulte o site oficial.`;
        logger.warn('Nenhuma partida encontrada');
      }
    } catch (error) {
      formatters.handleUpdateError(this.dialogTree, 'match_history', `Erro no histórico: ${error.message}`, this.teamName);
    }
  }

  // Atualizar escalação
  async updateLineup($) {
    try {
      // Inicializar estrutura se necessário
      dialogTreeManager.ensureNode(this.dialogTree, 'current_lineup', {
        suggestedResponses: ["Voltar ao início", "Próximo jogo", "Ver resultados"],
        intents: {
          initial: ["voltar", "início"],
          next_game: ["próximo jogo", "próxima partida"],
          match_history: ["resultados", "histórico", "partidas"]
        }
      });

      logger.info('Atualizando escalação');
      
      // Extrair jogadores por função
      const { titular, substitute, staff, foundAnyPlayers } = await lineupExtractor.extractLineup($);
      
      // Montar resposta
      if (foundAnyPlayers) {
        this.dialogTree.current_lineup.content = formatters.formatLineup(titular, substitute, staff, this.teamName);
        logger.info(`Escalação: ${titular.length} titulares, ${substitute.length} reservas, ${staff.length} staff`);
      } else {
        this.dialogTree.current_lineup.content = formatters.getDefaultLineup(this.teamName);
        logger.warn('Nenhum jogador encontrado, usando dados padrão');
      }
    } catch (error) {
      formatters.handleUpdateError(this.dialogTree, 'current_lineup', `Erro na escalação: ${error.message}`, this.teamName);
    }
  }

  // Obter árvore de diálogo
  getDialogTree() {
    return this.dialogTree || dialogTreeManager.getDefaultTree();
  }
}

module.exports = new ScrapingService();