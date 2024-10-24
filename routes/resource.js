const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authMiddleware, authorize } = require('../middleware/auth');

// Criar um novo recurso - disponível apenas para administradores
router.post('/', authMiddleware, authorize('admin'), async (req, res) => {
    const { name, type, description, quantity } = req.body;

    try {
        const resource = new Resource({ name, type, description, quantity });
        await resource.save();
        res.status(201).json({ msg: 'Recurso criado com sucesso!', resource });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao criar recurso' });
    }
});

// Obter todos os recursos - disponível para todos (funcionários, gerentes e administradores)
router.get('/', authMiddleware, authorize('funcionario', 'gerente', 'admin'), async (req, res) => {
    try {
        const resources = await Resource.find();
        res.json(resources);
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao obter recursos' });
    }
});

// Atualizar um recurso por ID - disponível para gerentes e administradores
router.put('/:id', authMiddleware, authorize('gerente', 'admin'), async (req, res) => {
    const { id } = req.params;
    const { name, type, description, quantity } = req.body;

    try {
        const resource = await Resource.findByIdAndUpdate(id, { name, type, description, quantity }, { new: true });
        if (!resource) {
            return res.status(404).json({ msg: 'Recurso não encontrado' });
        }
        res.json({ msg: 'Recurso atualizado com sucesso!', resource });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao atualizar recurso' });
    }
});

// Excluir um recurso por ID - disponível apenas para administradores
router.delete('/:id', authMiddleware, authorize('admin'), async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await Resource.findByIdAndDelete(id);
        if (!resource) {
            return res.status(404).json({ msg: 'Recurso não encontrado' });
        }
        res.json({ msg: 'Recurso excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao excluir recurso' });
    }
});

module.exports = router;