const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
        return res.status(401).json({ msg: 'Sem autorização, token ausente' });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'Usuário não encontrado' });
        }
        req.user = { id: user.id, role: user.role };
        
        console.log('Usuário autenticado:', req.user);  // Adicione este log
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido' });
    }
};

// const adminMiddleware = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ msg: 'Acesso negado, apenas administradores podem realizar esta ação' });
//     }
//     next();
// };

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
      console.log('Verificando autorização para:', req.user);  // Log para depuração
  
      if (!req.user) {
        return res.status(401).json({ msg: 'Usuário não autenticado' });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        console.log('Acesso negado. Papel do usuário:', req.user.role);  // Log para depuração
        return res.status(403).json({ msg: 'Acesso negado, você não tem permissão para acessar esta rota' });
      }
  
      next();
    };
  };

module.exports = { authMiddleware, authorize };