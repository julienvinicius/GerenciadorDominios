const pool = require('../config/database');

class ConfigController {
    // Listar todas as configurações
    async index(req, res) {
        try {
            const [configs] = await pool.query('SELECT * FROM system_configs');
            res.json(configs);
        } catch (error) {
            console.error('Erro ao buscar configurações:', error);
            res.status(500).json({
                error: 'Erro ao buscar configurações',
                details: error.message
            });
        }
    }

    // Atualizar uma configuração
    async update(req, res) {
        try {
            const { key, value } = req.body;

            // Validar se a configuração existe
            const [existingConfig] = await pool.query(
                'SELECT * FROM system_configs WHERE config_key = ?',
                [key]
            );

            if (existingConfig.length === 0) {
                return res.status(404).json({
                    error: 'Configuração não encontrada',
                    details: 'A configuração especificada não existe'
                });
            }

            // Atualizar a configuração
            await pool.query(
                'UPDATE system_configs SET config_value = ? WHERE config_key = ?',
                [value, key]
            );

            res.json({
                key,
                value,
                updated_at: new Date()
            });
        } catch (error) {
            console.error('Erro ao atualizar configuração:', error);
            res.status(500).json({
                error: 'Erro ao atualizar configuração',
                details: error.message
            });
        }
    }

    // Obter valor de uma configuração específica
    async getValue(req, res) {
        try {
            const { key } = req.params;

            const [config] = await pool.query(
                'SELECT config_value FROM system_configs WHERE config_key = ?',
                [key]
            );

            if (config.length === 0) {
                return res.status(404).json({
                    error: 'Configuração não encontrada',
                    details: 'A configuração especificada não existe'
                });
            }

            res.json({ value: config[0].config_value });
        } catch (error) {
            console.error('Erro ao buscar valor da configuração:', error);
            res.status(500).json({
                error: 'Erro ao buscar valor da configuração',
                details: error.message
            });
        }
    }

    // Resetar configurações para valores padrão
    async reset(req, res) {
        try {
            const defaultConfigs = [
                ['alert_days', '30'],
                ['check_interval', '24'],
                ['email_notifications', 'true'],
                ['auto_renewal', 'false']
            ];

            for (const [key, value] of defaultConfigs) {
                await pool.query(
                    'UPDATE system_configs SET config_value = ? WHERE config_key = ?',
                    [value, key]
                );
            }

            res.json({
                message: 'Configurações resetadas com sucesso',
                updated_at: new Date()
            });
        } catch (error) {
            console.error('Erro ao resetar configurações:', error);
            res.status(500).json({
                error: 'Erro ao resetar configurações',
                details: error.message
            });
        }
    }
}

module.exports = new ConfigController(); 