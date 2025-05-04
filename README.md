# FURIA Fan Chat
Bem-vindo ao FURIA Fan Chat! Este projeto é uma aplicação de chatbot desenvolvida para os fãs do time de CS da FURIA, permitindo acesso rápido e interativo a informações atualizadas sobre jogos, escalações e resultados. Com uma interface intuitiva, os usuários podem facilmente obter dados em tempo real através de conversas naturais com o bot, acompanhando de perto todas as novidades do time. Seja você um fã casual ou hardcore, o FURIA Fan Chat é sua fonte confiável para se manter conectado com sua equipe favorita.

## Índice
- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Árvore de Diálogo](#árvore-de-diálogo)
- [Sistema de Scraping](#sistema-de-scraping)
- [API](#api)
- [Armazenamento Local](#armazenamento-local)

## Sobre o Projeto
FURIA Fan Chat é uma aplicação de chat interativa desenvolvida para os fãs do time de CS da FURIA. O projeto consiste em uma interface conversacional onde os usuários podem interagir com um chatbot para obter informações atualizadas sobre o time, jogadores, partidas, torneios e outras informações relacionadas à organização FURIA.

O chatbot utiliza um sistema de scraping para coletar informações atualizadas sobre o time e jogadores, garantindo que os fãs tenham acesso aos dados mais recentes.

## Tecnologias Utilizadas
#### Backend
- Node.js - Ambiente de execução
- Express - Framework web
- MongoDB - Banco de dados
- Puppeteer - Biblioteca para web scraping
- Cheerio - Parser HTML para extração de dados
- Winston - Biblioteca de logging
#### Frontend
- React - Biblioteca JavaScript para interfaces
- TypeScript - Superset JavaScript com tipagem estática
- Styled Components - Estilização de componentes
- React Router - Navegação entre páginas
- Axios - Cliente HTTP

## Estrutura do Projeto
O projeto é dividido em duas partes principais:
#### Backend
- config/: Configurações do banco de dados e variáveis - de ambiente
- controllers/: Controladores da aplicação
- models/: Modelos de dados
- routes/: Rotas da API
- middleware/: Middleware para tratamento de erros
- services/: Lógica de negócios e serviços
- scraping/: Serviços de scraping para coletar dados
- dialogTree.js: Gerenciamento da árvore de diálogo
- formatters.js: Formatação de respostas
- lineup.js: Extração de escalação de jogadores
- matches.js: Extração de partidas
- utils/: Funções utilitárias
- logger.js: Configuração de logs
- app.js: Configuração da aplicação Express
- server.js: Inicialização do servidor

#### Frontend
- components/: Componentes React reutilizáveis
- common/: Componentes comuns (Button, Loader, etc.)
- layout/: Componentes de layout (Header, Footer, etc.)
- Chat/: Componentes relacionados ao chat
- context/: Contextos React para gerenciamento de estado
- hooks/: Hooks personalizados
- pages/: Páginas da aplicação
- services/: Serviços para comunicação com o backend
- styles/: Arquivos de estilo
- types/: Definições de tipos TypeScript
- utils/: Funções utilitárias
- storage.ts: Gerenciamento de armazenamento local

## Instalação
#### Pré-requisitos
- Node.js (v14+)
- MongoDB
- npm ou yarn

#### Backend
1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/furia-fan-chat.git
cd furia-fan-chat/backend
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente

#### Frontend
1. Navegue até a pasta do frontend
```bash
cd ../frontend
```

2. Instale as dependências
```bash
npm install
```

## Como executar
#### Backend
```bash
cd backend
npm start
```
Para desenvolvimento com reload automático:
```bash
npm run dev
```

#### Frontend
```bash
cd frontend
npm start
```

## Funcionalidades
#### Principais recursos
- Chat Interativo: Interface amigável para conversa com o bot da FURIA
- Informações Atualizadas: Dados em tempo real sobre próximos jogos, escalação e resultados
- Histórico de Conversas: Armazenamento local das mensagens do usuário
- Respostas Sugeridas: Botões para facilitar a navegação no diálogo
- Design Responsivo: Adaptação para dispositivos móveis e desktop
#### Fluxos de Conversa
- Informações sobre próximos jogos
- Detalhes sobre a escalação atual
- Histórico de partidas recentes
- Curiosidades sobre os jogadores
- Informações sobre a organização FURIA

## Árvore de Diálogo
```bash
{
  "initial": {
    "content": "Olá, sou o bot da FURIA! Como posso ajudar?",
    "suggestedResponses": ["Próximo jogo", "Escalação atual", "Histórico de partidas"],
    "intents": {
      "next_game": ["próximo jogo", "quando joga", "partida"],
      "current_lineup": ["escalação", "jogadores", "time"],
      "match_history": ["histórico", "resultados", "últimos jogos"]
    }
  },
  "next_game": {
    "content": "O próximo jogo da FURIA será...",
    "suggestedResponses": ["Mais detalhes", "Voltar"],
    "intents": {
      "match_details": ["detalhes", "mais informações"],
      "initial": ["voltar", "início"]
    }
  }
}
```

## Sistema de Scraping
O sistema de scraping coleta dados em tempo real de diversas fontes:

#### Funcionalidades de Scraping
- Próximos Jogos: Data, hora e adversário
- Escalação Atual: Nome dos jogadores titulares, reservas e coaches
- Histórico de Partidas: Resultados recentes e placares
#### Implementação
O sistema usa Puppeteer para acessar sites e Cheerio para extrair dados estruturados. Os dados são armazenados no MongoDB e atualizados periodicamente.

## API
#### Endpoints do Chatbot
```GET /api/chatbot/initia```
- **Descrição**: Obtém a mensagem inicial do chatbot
- **Resposta**: ```{ message: string, suggestedResponses: string[], state: string }```

```POST /api/chatbot/message```
- **Descrição**: Envia uma mensagem para o chatbot
- **Corpo da requisição**: ```{ message: string, currentState: string }```
- **Resposta**: ```{ userMessage: string, botResponse: string, suggestedResponses: string[], nextState: string }```

```GET /api/match/next```
- **Descrição**: Obtém informações sobre o próximo jogo
- **Resposta**: ```{ opponent: string, date: Date, tournament: string, maps: string[] }```

```GET /api/team/lineup```
- **Descrição**: Obtém a escalação atual do time
- **Resposta**: ```{ players: [{ name: string, role: string, nickname: string }] }```

## Armazenamento Local
O frontend utiliza o localStorage para persistência de dados.
