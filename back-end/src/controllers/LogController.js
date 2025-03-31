const pool = require('../config/database');

class LogController {
    // Listar todos os logs
    async index(req, res) {
        try {
            const [logs] = await pool.query(`
                SELECT 
                    l.id,
                    l.action,
                    l.details,
                    l.created_at,
                    l.domain_id,
                    d.name as domain_name,
                    l.registrar_id,
                    r.name as registrar_name
                FROM logs l
                LEFT JOIN domains d ON l.domain_id = d.id
                LEFT JOIN registrars r ON l.registrar_id = r.id
                ORDER BY l.created_at DESC
                LIMIT 100
            `);

            res.json(logs);
        } catch (error) {
            console.error('Erro ao buscar logs:', error);
            res.status(500).json({
                error: 'Erro ao buscar logs',
                details: error.message
            });
        }
    }

    // Registrar um novo log
    async store(req, res) {
        try {
            const { action, details, domain_id, registrar_id } = req.body;

            const [result] = await pool.query(
                'INSERT INTO logs (action, details, domain_id, registrar_id) VALUES (?, ?, ?, ?)',
                [action, details, domain_id, registrar_id]
            );

            res.status(201).json({
                id: result.insertId,
                action,
                details,
                domain_id,
                registrar_id,
                created_at: new Date()
            });
        } catch (error) {
            console.error('Erro ao registrar log:', error);
            res.status(500).json({
                error: 'Erro ao registrar log',
                details: error.message
            });
        }
    }

    // Buscar logs por domínio
    async getByDomain(req, res) {
        try {
            const { domain_id } = req.params;

            const [logs] = await pool.query(`
                SELECT 
                    l.id,
                    l.action,
                    l.details,
                    l.created_at
                FROM logs l
                WHERE l.domain_id = ?
                ORDER BY l.created_at DESC
            `, [domain_id]);

            res.json(logs);
        } catch (error) {
            console.error('Erro ao buscar logs do domínio:', error);
            res.status(500).json({
                error: 'Erro ao buscar logs do domínio',
                details: error.message
            });
        }
    }

    // Buscar logs por registrador
    async getByRegistrar(req, res) {
        try {
            const { registrar_id } = req.params;

            const [logs] = await pool.query(`
                SELECT 
                    l.id,
                    l.action,
                    l.details,
                    l.created_at,
                    l.domain_id,
                    d.name as domain_name
                FROM logs l
                LEFT JOIN domains d ON l.domain_id = d.id
                WHERE l.registrar_id = ?
                ORDER BY l.created_at DESC
            `, [registrar_id]);

            res.json(logs);
        } catch (error) {
            console.error('Erro ao buscar logs do registrador:', error);
            res.status(500).json({
                error: 'Erro ao buscar logs do registrador',
                details: error.message
            });
        }
    }
}

module.exports = new LogController(); 