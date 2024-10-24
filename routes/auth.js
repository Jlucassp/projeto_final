const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de Usuário
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Verificar se o usuário já existe
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Usuário já existe' });
        }

        user = new User({ username, password, role });
        await user.save();

        res.status(201).json({ msg: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao registrar usuário' });
    }
});

// Login de Usuário
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar se o usuário existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        // Verificar a senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        // Gerar o token JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Erro ao fazer login' });
    }
});

module.exports = router;