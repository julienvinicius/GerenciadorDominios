const pool = require('../config/database');

class AlertController {
    // Listar todos os alertas
    async index(req, res) {
        try {
            const [alerts] = await pool.query(`
                SELECT 
                    a.id,
                    a.domain_id,
                    d.name as domain_name,
                    a.type,
                    a.message,
                    a.created_at,
                    a.read_at,
                    a.status
                FROM alerts a
                LEFT JOIN domains d ON a.domain_id = d.id
                ORDER BY a.created_at DESC
            `);

            res.json(alerts);
        } catch (error) {
            console.error('Erro ao buscar alertas:', error);
            res.status(500).json({
                error: 'Erro ao buscar alertas',
                details: error.message
            });
        }
    }

    // Marcar alerta como lido
    async markAsRead(req, res) {
        try {
            const { id } = req.params;

            await pool.query(
                'UPDATE alerts SET read_at = NOW(), status = ? WHERE id = ?',
                ['read', id]
            );

            res.json({
                message: 'Alerta marcado como lido',
                updated_at: new Date()
            });
        } catch (error) {
            console.error('Erro ao marcar alerta como lido:', error);
            res.status(500).json({
                error: 'Erro ao marcar alerta como lido',
                details: error.message
            });
        }
    }

    // Marcar todos os alertas como lidos
    async markAllAsRead(req, res) {
        try {
            await pool.query(
                'UPDATE alerts SET read_at = NOW(), status = ? WHERE read_at IS NULL',
                ['read']
            );

            res.json({
                message: 'Todos os alertas foram marcados como lidos',
                updated_at: new Date()
            });
        } catch (error) {
            console.error('Erro ao marcar alertas como lidos:', error);
            res.status(500).json({
                error: 'Erro ao marcar alertas como lidos',
                details: error.message
            });
        }
    }

    // Buscar alertas não lidos
    async getUnread(req, res) {
        try {
            const [alerts] = await pool.query(`
                SELECT 
                    a.id,
                    a.domain_id,
                    d.name as domain_name,
                    a.type,
                    a.message,
                    a.created_at,
                    a.status
                FROM alerts a
                LEFT JOIN domains d ON a.domain_id = d.id
                WHERE a.read_at IS NULL
                ORDER BY a.created_at DESC
            `);

            res.json(alerts);
        } catch (error) {
            console.error('Erro ao buscar alertas não lidos:', error);
            res.status(500).json({
                error: 'Erro ao buscar alertas não lidos',
                details: error.message
            });
        }
    }

    // Verificar domínios próximos da expiração e criar alertas
    async checkExpiringDomains(req, res) {
        try {
            // Buscar configuração de dias para alerta
            const [config] = await pool.query(
                'SELECT config_value FROM system_configs WHERE config_key = ?',
                ['alert_days']
            );
            const alertDays = parseInt(config[0]?.config_value || '30');

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
            `, [alertDays]);

            // Criar alertas para cada domínio
            for (const domain of domains) {
                const message = `O domínio ${domain.name} expira em ${domain.days_until_expiry} dias`;
                
                await pool.query(
                    'INSERT INTO alerts (domain_id, type, message, status) VALUES (?, ?, ?, ?)',
                    [domain.id, 'expiration', message, 'unread']
                );
            }

            res.json({
                message: 'Verificação de domínios concluída',
                domains_checked: domains.length,
                timestamp: new Date()
            });
        } catch (error) {
            console.error('Erro ao verificar domínios próximos da expiração:', error);
            res.status(500).json({
                error: 'Erro ao verificar domínios próximos da expiração',
                details: error.message
            });
        }
    }
}

module.exports = new AlertController(); 