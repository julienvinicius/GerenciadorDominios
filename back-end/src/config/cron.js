const cron = require('node-cron');
const pool = require('./database');

// Função para verificar domínios próximos da expiração
const checkExpiringDomains = async () => {
    try {
        // Buscar configuração de intervalo
        const [config] = await pool.query(
            'SELECT config_value FROM system_configs WHERE config_key = ?',
            ['check_interval']
        );
        const checkInterval = parseInt(config[0]?.config_value || '24');

        // Buscar domínios próximos da expiração
        const [domains] = await pool.query(`
            SELECT 
                d.id,
                d.name,
                d.expiration_date,
                DATEDIFF(d.expiration_date, CURDATE()) as days_until_expiry
            FROM domains d
            WHERE d.expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
            AND d.id NOT IN (
                SELECT domain_id 
                FROM alerts 
                WHERE type = 'expiration' 
                AND created_at > DATE_SUB(CURDATE(), INTERVAL 1 DAY)
            )
        `, [checkInterval]);

        // Criar alertas para cada domínio
        for (const domain of domains) {
            const message = `O domínio ${domain.name} expira em ${domain.days_until_expiry} dias`;
            
            await pool.query(
                'INSERT INTO alerts (domain_id, type, message, status) VALUES (?, ?, ?, ?)',
                [domain.id, 'expiration', message, 'unread']
            );

            // Registrar log
            await pool.query(
                'INSERT INTO logs (action, details, domain_id) VALUES (?, ?, ?)',
                ['alert_created', message, domain.id]
            );
        }

        console.log(`Verificação de domínios concluída. ${domains.length} domínios verificados.`);
    } catch (error) {
        console.error('Erro ao verificar domínios:', error);
    }
};

// Agendar verificação diária às 8h da manhã
const scheduleDomainCheck = () => {
    cron.schedule('0 8 * * *', checkExpiringDomains);
    console.log('Verificação de domínios agendada para 8h da manhã todos os dias');
};

module.exports = {
    checkExpiringDomains,
    scheduleDomainCheck
}; 