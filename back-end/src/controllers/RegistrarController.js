const pool = require('../config/database');

class RegistrarController {
    // Listar todos os registradores
    async index(req, res) {
        try {
            console.log('Buscando registradores...');
            const [rows] = await pool.query('SELECT * FROM registrars ORDER BY name');
            console.log('Registradores encontrados:', rows);
            res.json(rows);
        } catch (error) {
            console.error('Erro ao buscar registradores:', error);
            res.status(500).json({ error: 'Erro ao buscar registradores' });
        }
    }

    // Buscar um registrador específico
    async show(req, res) {
        try {
            const [registrar] = await pool.query(
                'SELECT * FROM registrars WHERE id = ?',
                [req.params.id]
            );

            if (registrar.length === 0) {
                return res.status(404).json({ error: 'Registrador não encontrado' });
            }

            res.json(registrar[0]);
        } catch (error) {
            console.error('Erro ao buscar registrador:', error);
            res.status(500).json({ error: 'Erro ao buscar registrador' });
        }
    }

    // Criar um novo registrador
    async store(req, res) {
        try {
            const { name } = req.body;
            console.log('Dados recebidos para criar registrador:', { name });

            // Validar nome
            if (!name || name.trim() === '') {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: ['O nome do registrador é obrigatório']
                });
            }

            // Verificar se o registrador já existe
            const [existingRegistrar] = await pool.query(
                'SELECT id FROM registrars WHERE name = ?',
                [name]
            );

            if (existingRegistrar.length > 0) {
                console.error('Registrador já existe:', name);
                return res.status(409).json({
                    error: 'Registrador já existe',
                    details: 'Um registrador com este nome já existe no sistema'
                });
            }

            // Inserir o registrador com valores padrão para os campos obrigatórios
            console.log('Inserindo registrador no banco...');
            const [result] = await pool.query(
                'INSERT INTO registrars (name, api_url, api_key, api_secret) VALUES (?, ?, ?, ?)',
                [name, 'https://api.example.com', 'default_key', 'default_secret']
            );

            // Buscar o registrador recém-criado
            const [registrar] = await pool.query(
                'SELECT * FROM registrars WHERE id = ?',
                [result.insertId]
            );

            console.log('Registrador criado com sucesso:', registrar[0]);
            res.status(201).json(registrar[0]);
        } catch (error) {
            console.error('Erro detalhado ao criar registrador:', error);
            console.error('Stack trace:', error.stack);
            res.status(500).json({
                error: 'Erro ao criar registrador',
                details: error.message
            });
        }
    }

    // Atualizar um registrador
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Validar nome
            if (!name || name.trim() === '') {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: ['O nome do registrador é obrigatório']
                });
            }

            // Verificar se o registrador existe
            const [existingRegistrar] = await pool.query(
                'SELECT id FROM registrars WHERE id = ?',
                [id]
            );

            if (existingRegistrar.length === 0) {
                return res.status(404).json({ error: 'Registrador não encontrado' });
            }

            // Verificar se o novo nome já existe para outro registrador
            const [duplicateName] = await pool.query(
                'SELECT id FROM registrars WHERE name = ? AND id != ?',
                [name, id]
            );

            if (duplicateName.length > 0) {
                return res.status(409).json({
                    error: 'Nome já existe',
                    details: 'Um registrador com este nome já existe no sistema'
                });
            }

            // Atualizar o registrador
            await pool.query(
                'UPDATE registrars SET name = ? WHERE id = ?',
                [name, id]
            );

            // Buscar o registrador atualizado
            const [registrar] = await pool.query(
                'SELECT * FROM registrars WHERE id = ?',
                [id]
            );

            res.json(registrar[0]);
        } catch (error) {
            console.error('Erro ao atualizar registrador:', error);
            res.status(500).json({ error: 'Erro ao atualizar registrador' });
        }
    }

    // Excluir um registrador
    async destroy(req, res) {
        try {
            const { id } = req.params;

            // Verificar se o registrador existe
            const [existingRegistrar] = await pool.query(
                'SELECT id FROM registrars WHERE id = ?',
                [id]
            );

            if (existingRegistrar.length === 0) {
                return res.status(404).json({ error: 'Registrador não encontrado' });
            }

            // Verificar se existem domínios associados
            const [domains] = await pool.query(
                'SELECT COUNT(*) as count FROM domains WHERE registrar_id = ?',
                [id]
            );

            if (domains[0].count > 0) {
                return res.status(409).json({
                    error: 'Registrador em uso',
                    details: 'Não é possível excluir um registrador que possui domínios associados'
                });
            }

            // Excluir o registrador
            await pool.query('DELETE FROM registrars WHERE id = ?', [id]);

            res.json({ message: 'Registrador excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir registrador:', error);
            res.status(500).json({ error: 'Erro ao excluir registrador' });
        }
    }
}

module.exports = new RegistrarController(); 