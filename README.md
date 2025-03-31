# Gerenciador de Domínios

Sistema para gerenciamento de domínios e registradores, desenvolvido com Vue.js e Node.js.

## 🚀 Tecnologias Utilizadas

### Frontend
- Vue.js 3
- Vite
- Tailwind CSS
- Axios
- Vue Router
- Vuex (para gerenciamento de estado)

### Backend
- Node.js
- Express
- MySQL
- JWT (para autenticação)
- CORS
- Dotenv (para variáveis de ambiente)

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gerenciador-dominios.git
cd gerenciador-dominios
```

2. Instale as dependências do frontend:
```bash
cd frontend
npm install
```

3. Instale as dependências do backend:
```bash
cd ../backend
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
   ```
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=gerenciadordominios
   PORT=8000
   NODE_ENV=development
   ```

5. Configure o banco de dados:
   - Crie um banco de dados MySQL chamado `gerenciadordominios`
   - Execute o script SQL fornecido em `backupSql.sql`

## 🚀 Executando o Projeto

1. Inicie o servidor backend:
```bash
cd backend
npm run dev
```

2. Em outro terminal, inicie o frontend:
```bash
cd frontend
npm run dev
```

3. Acesse a aplicação em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
gerenciador-dominios/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   ├── router/
│   │   └── App.vue
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── middlewares/
│   │   └── utils/
│   └── package.json
└── README.md
```

## 🔒 Funcionalidades

- Cadastro e gerenciamento de registradores
- Cadastro e gerenciamento de domínios
- Monitoramento de status dos domínios
- Alertas de domínios próximos da expiração
- Interface responsiva e moderna
- Validação de dados em tempo real
- Sistema de autenticação e autorização

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

1. Faça um Fork do projeto
2. Crie uma Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, envie um email para seu-email@exemplo.com ou abra uma issue no repositório. 