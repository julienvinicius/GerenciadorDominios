# Backend do Gerenciador de Domínios

Este é o backend da aplicação Gerenciador de Domínios, desenvolvido com Node.js, Express e MySQL.

## Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 8 ou superior)
- npm ou yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   PORT=8000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=gerenciador_dominios
   ```

4. Configure o banco de dados:
   - Crie um banco de dados MySQL chamado `gerenciador_dominios`
   - Execute o script SQL fornecido para criar as tabelas necessárias

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```
ou
```bash
yarn dev
```

Para produção:
```bash
npm start
```
ou
```bash
yarn start
```

## Endpoints da API

### Domínios

- `GET /api/domains` - Lista todos os domínios
- `GET /api/domains/:id` - Busca um domínio específico
- `POST /api/domains` - Cria um novo domínio
- `PUT /api/domains/:id` - Atualiza um domínio
- `DELETE /api/domains/:id` - Remove um domínio

### Registradores

- `GET /api/registrars` - Lista todos os registradores
- `GET /api/registrars/:id` - Busca um registrador específico
- `POST /api/registrars` - Cria um novo registrador
- `PUT /api/registrars/:id` - Atualiza um registrador
- `DELETE /api/registrars/:id` - Remove um registrador

## Estrutura do Projeto

```
back-end/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── DomainController.js
│   │   └── RegistrarController.js
│   ├── routes/
│   │   └── index.js
│   ├── utils/
│   │   └── validators.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Contribuição

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request 