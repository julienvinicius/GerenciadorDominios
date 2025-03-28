# Gerenciador de Domínios - Frontend

Frontend do sistema de gerenciamento de domínios desenvolvido com Vue.js 3, TypeScript e Tailwind CSS.

## Requisitos

- Node.js 16.x ou superior
- npm 7.x ou superior

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gerenciador-dominios.git
cd gerenciador-dominios/frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`.

## Funcionalidades

- Dashboard com visão geral dos domínios
- Gerenciamento de domínios (criar, editar, excluir)
- Configurações DNS
- Transferências de domínio
- Configurações de segurança
- Autenticação de usuários

## Tecnologias Utilizadas

- Vue.js 3
- TypeScript
- Vue Router
- Pinia (Gerenciamento de Estado)
- Tailwind CSS
- Vite

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── assets/         # Recursos estáticos
│   ├── components/     # Componentes Vue
│   ├── router/         # Configuração de rotas
│   ├── stores/         # Stores Pinia
│   ├── types/          # Definições de tipos TypeScript
│   ├── views/          # Páginas/Views
│   ├── App.vue         # Componente raiz
│   └── main.ts         # Ponto de entrada
├── public/             # Arquivos públicos
├── index.html          # Template HTML
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── tailwind.config.js  # Configuração Tailwind CSS
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run preview`: Visualiza a versão de produção localmente

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
