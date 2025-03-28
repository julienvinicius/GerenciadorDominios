# Gerenciador de Domínios

Sistema de gerenciamento de domínios desenvolvido com Vue.js 3 e Laravel.

## Estrutura do Projeto

```
├── frontend/     # Aplicação Vue.js
└── backend/      # API Laravel
```

## Requisitos

- PHP >= 8.1
- Composer
- Node.js >= 16
- NPM ou Yarn
- MySQL/MariaDB

## Funcionalidades

- Gerenciamento de domínios (CRUD)
- Monitoramento de status dos domínios
- Gerenciamento de DNS
- Notificações de expiração
- Autenticação e autorização
- Dashboard interativo

## Configuração do Frontend

```bash
cd frontend
npm install
npm run dev
```

## Configuração do Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Tecnologias Utilizadas

### Frontend
- Vue.js 3
- Vue Router
- Pinia
- Tailwind CSS
- Axios
- TypeScript

### Backend
- Laravel 10
- Laravel Sanctum
- MySQL
- Redis (cache)

## Convenções de Código

- Utilize TypeScript para todo código frontend
- Siga as convenções PSR-12 para o código PHP
- Commits devem seguir o padrão Conventional Commits
- Documentação em português

## Desenvolvimento

1. Clone o repositório
2. Configure o ambiente de desenvolvimento
3. Siga as instruções de configuração para frontend e backend
4. Crie uma branch para sua feature
5. Envie um Pull Request 