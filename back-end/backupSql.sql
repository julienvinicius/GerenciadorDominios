-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS GerenciadorDominios;
USE GerenciadorDominios;

-- Criar tabela de registradores
CREATE TABLE registrars (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    api_url VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de domínios
CREATE TABLE domains (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    registrar_id BIGINT UNSIGNED NOT NULL,
    status VARCHAR(50) NOT NULL,
    expiration_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (registrar_id) REFERENCES registrars(id)
);

-- Criar tabela de transferências de domínio
CREATE TABLE domain_transfers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    domain_id BIGINT UNSIGNED NOT NULL,
    from_registrar VARCHAR(255) NOT NULL,
    to_registrar VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    estimated_completion_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id)
);

-- Inserir alguns registradores de exemplo
INSERT INTO registrars (name, api_url, api_key, api_secret, status) VALUES
('GoDaddy', 'https://api.godaddy.com/v1', 'exemplo_key_1', 'exemplo_secret_1', 'active'),
('Namecheap', 'https://api.namecheap.com/v1', 'exemplo_key_2', 'exemplo_secret_2', 'active'),
('Cloudflare', 'https://api.cloudflare.com/v1', 'exemplo_key_3', 'exemplo_secret_3', 'active');

-- Inserir alguns domínios de exemplo
INSERT INTO domains (name, registrar_id, status, expiration_date, notes) VALUES
('exemplo1.com', 1, 'active', '2024-12-31', 'Domínio principal'),
('exemplo2.com', 2, 'active', '2024-10-15', 'Domínio secundário'),
('exemplo3.com', 3, 'pending', '2024-08-20', 'Novo domínio');

-- Inserir algumas transferências de exemplo
INSERT INTO domain_transfers (domain_id, from_registrar, to_registrar, status, start_date, estimated_completion_date, notes) VALUES
(1, 'GoDaddy', 'Namecheap', 'pending', '2024-03-28', '2024-04-05', 'Transferência em andamento'),
(2, 'Namecheap', 'Cloudflare', 'in_progress', '2024-03-27', '2024-04-03', 'Transferência iniciada');