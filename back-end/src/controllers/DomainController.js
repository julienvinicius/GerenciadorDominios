const pool = require('../config/database');
const { validateDomainData } = require('../utils/validators');

class DomainController {
    // Listar todos os domínios
    async index(req, res) {
        try {
            console.log('Buscando domínios...');
            const [rows] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.registrar_id,
                    d.expiration_date,
                    d.notes,
                    r.name as registrar_name,
                    CASE
                        WHEN d.expiration_date < CURDATE() THEN 'expirado'
                        WHEN d.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'expirando'
                        ELSE 'ativo'
                    END as status
                FROM domains d 
                LEFT JOIN registrars r ON d.registrar_id = r.id
            `);
            console.log('Domínios encontrados:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar domínios:', error);
            res.status(500).json({ error: 'Erro ao buscar domínios' });
        }
    }

    // Buscar um domínio específico
    async show(req, res) {
        try {
            const [domain] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.registrar_id,
                    d.expiration_date,
                    d.notes,
                    r.name as registrar_name,
                    CASE
                        WHEN d.expiration_date < CURDATE() THEN 'expirado'
                        WHEN d.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'expirando'
                        ELSE 'ativo'
                    END as status
                FROM domains d 
                LEFT JOIN registrars r ON d.registrar_id = r.id 
                WHERE d.id = ?
            `, [req.params.id]);

            if (domain.length === 0) {
                return res.status(404).json({ error: 'Domínio não encontrado' });
            }

            res.json(domain[0]);
        } catch (error) {
            console.error('Erro ao buscar domínio:', error);
            res.status(500).json({ error: 'Erro ao buscar domínio' });
        }
    }

    // Criar um novo domínio
    async store(req, res) {
        try {
            const { name, registrar_id, expiration_date } = req.body;
            console.log('Dados recebidos para criar domínio:', { name, registrar_id, expiration_date });

            // Validar dados
            const errors = validateDomainData({
                name,
                registrar_id,
                expiry_date: expiration_date
            });
            if (errors.length > 0) {
                console.error('Erros de validação:', errors);
                return res.status(400).json({ error: 'Dados inválidos', details: errors });
            }

            // Verificar se o domínio já existe
            const [existingDomain] = await pool.query(
                'SELECT id FROM domains WHERE name = ?',
                [name]
            );

            if (existingDomain.length > 0) {
                console.error('Domínio já existe:', name);
                return res.status(409).json({
                    error: 'Domínio já registrado',
                    details: 'Um domínio com este nome já existe no sistema'
                });
            }

            // Verificar se o registrador existe
            const [registrar] = await pool.query(
                'SELECT id, name FROM registrars WHERE id = ?',
                [registrar_id]
            );

            if (registrar.length === 0) {
                console.error('Registrador não encontrado:', registrar_id);
                return res.status(404).json({
                    error: 'Registrador não encontrado',
                    details: 'O registrador especificado não existe no sistema'
                });
            }

            // Determinar o status com base na data de expiração
            const expiryDate = new Date(expiration_date);
            const today = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(today.getDate() + 30);

            let status;
            if (expiryDate < today) {
                status = 'inactive';
            } else if (expiryDate <= thirtyDaysFromNow) {
                status = 'pending';
            } else {
                status = 'active';
            }

            // Inserir o domínio
            console.log('Inserindo domínio no banco...');
            const [result] = await pool.query(
                'INSERT INTO domains (name, registrar_id, expiration_date, status) VALUES (?, ?, ?, ?)',
                [name, registrar_id, expiration_date, status]
            );

            // Buscar o domínio recém-criado
            const [domain] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.registrar_id,
                    d.expiration_date,
                    d.notes,
                    r.name as registrar_name,
                    d.status
                FROM domains d 
                LEFT JOIN registrars r ON d.registrar_id = r.id 
                WHERE d.id = ?
            `, [result.insertId]);

            console.log('Domínio criado com sucesso:', domain[0]);
            res.status(201).json(domain[0]);
        } catch (error) {
            console.error('Erro detalhado ao criar domínio:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({
                error: 'Erro ao criar domínio',
                details: error.message
            });
        }
    }

    // Atualizar um domínio
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, registrar_id, expiry_date, notes } = req.body;

            // Validar dados
            const errors = validateDomainData(req.body);
            if (errors.length > 0) {
                return res.status(400).json({ error: 'Dados inválidos', details: errors });
            }

            // Verificar se o domínio existe
            const [existingDomain] = await pool.query(
                'SELECT id FROM domains WHERE id = ?',
                [id]
            );

            if (existingDomain.length === 0) {
                return res.status(404).json({ error: 'Domínio não encontrado' });
            }

            // Atualizar o domínio
            await pool.query(
                'UPDATE domains SET name = ?, registrar_id = ?, expiration_date = ?, notes = ? WHERE id = ?',
                [name, registrar_id, expiry_date, notes, id]
            );

            // Buscar o domínio atualizado
            const [domain] = await pool.query(`
                SELECT 
                    d.id,
                    d.name,
                    d.registrar_id,
                    d.expiration_date,
                    d.notes,
                    r.name as registrar_name,
                    CASE
                        WHEN d.expiration_date < CURDATE() THEN 'expirado'
                        WHEN d.expiration_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'expirando'
                        ELSE 'ativo'
                    END as status
                FROM domains d 
                LEFT JOIN registrars r ON d.registrar_id = r.id 
                WHERE d.id = ?
            `, [id]);

            res.json(domain[0]);
        } catch (error) {
            console.error('Erro ao atualizar domínio:', error);
            res.status(500).json({ error: 'Erro ao atualizar domínio' });
        }
    }

    // Excluir um domínio
    async destroy(req, res) {
        try {
            const { id } = req.params;

            // Verificar se o domínio existe
            const [existingDomain] = await pool.query(
                'SELECT id FROM domains WHERE id = ?',
                [id]
            );

            if (existingDomain.length === 0) {
                return res.status(404).json({ error: 'Domínio não encontrado' });
            }

            // Excluir o domínio
            await pool.query('DELETE FROM domains WHERE id = ?', [id]);

            res.json({ message: 'Domínio excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir domínio:', error);
            res.status(500).json({ error: 'Erro ao excluir domínio' });
        }
    }
}

module.exports = new DomainController(); 