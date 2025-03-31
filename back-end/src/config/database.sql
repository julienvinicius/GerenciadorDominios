-- Tabela de logs
CREATE TABLE IF NOT EXISTS logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    domain_id BIGINT UNSIGNED,
    registrar_id BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE SET NULL,
    FOREIGN KEY (registrar_id) REFERENCES registrars(id) ON DELETE SET NULL
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de alertas
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    domain_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- Inserir configurações padrão
INSERT INTO system_configs (config_key, config_value, description) VALUES
('alert_days', '30', 'Número de dias antes da expiração para gerar alertas'),
('check_interval', '24', 'Intervalo em horas para verificar domínios próximos da expiração'),
('email_notifications', 'true', 'Habilitar notificações por email'),
('auto_renewal', 'false', 'Habilitar renovação automática de domínios')
AS new_config
ON DUPLICATE KEY UPDATE 
    config_value = new_config.config_value; 