# Projeto CRUD Simples em Node.js

## Introdução

Desenvolvido por Bruno Michael, este projeto Node.js representa uma fase inicial no meu aprendizado da linguagem. Ainda não tenho conhecimento completo de Node.js, mas estou em processo de estudo contínuo. Este CRUD simples é um começo, e planejo expandir meus conhecimentos com projetos futuros, possivelmente incluindo um CRUD com autenticação de login. A documentação será enriquecida aos poucos, refletindo meu progresso e aprendizado na área.

## Configuração do Projeto

Siga as instruções abaixo para configurar o projeto e suas dependências:

## Pré-requisitos

Certifique-se de ter o Node.js instalado em seu sistema.

## Instalação

Siga os passos abaixo para configurar o seu projeto:

### 1. Clone o Repositório

Clone o repositório do projeto para o seu sistema local.

```bash
git clone https://github.com/BrunoMichael/Projeto-CRUD-Nodejs.git
```

### 2. Instale as Dependências

Navegue até a pasta do projeto e instale as dependências necessárias.

```bash
cd [NOME_DA_PASTA_DO_PROJETO]
npm install
```

### Dependências Principais

- `express`: Framework para criar o servidor.
- `body-parser`: Middleware para parsear o corpo das requisições.
- `socket.io`: Para comunicação em tempo real.
- `ejs`: Motor de visualização.
- `mysql2`: Para conexão com o banco de dados MySQL.
- `nodemon`: Ferramenta que reinicia automaticamente o servidor Node.js quando há mudanças nos arquivos, otimizando o desenvolvimento.

### 3. Configuração do Banco de Dados MySQL

Para configurar a conexão com o banco de dados MySQL, crie um arquivo `Mysql.js` com o seguinte conteúdo:

```javascript
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'SEU_HOST',
    user: 'SEU_USUARIO',
    database: 'SEU_DATABASE',
    password: 'SUA_SENHA'
    // Adicione a opção SSL aqui, se necessário
});

module.exports = pool.promise();
```

### 4. Inicie o Servidor

Execute o seguinte comando para iniciar o servidor:

```bash
nodemon index.js
```

O servidor agora estará rodando na porta 5000.

## Testando

Abra o navegador e acesse `http://localhost:5000` para verificar se o servidor está funcionando corretamente.

## Observação

Este projeto está em constante evolução e a documentação será atualizada regularmente para refletir mudanças e melhorias.

## Navegação da Documentação

Para uma explicação detalhada dos arquivos e sua funcionalidade, consulte os seguintes documentos:

- [Home](./docs/html.md): Explicação do arquivo `html.html` e sua estrutura.

Certifique-se de verificar regularmente a pasta `docs/` para atualizações e novas adições à documentação.

