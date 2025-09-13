import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import {register, login, logout, updatePassword} from '../controllers/authController.js' 


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.patch('/update-password', authMiddleware, updatePassword);
router.get('/auth-user', authMiddleware, (req, res) => {
    res.json({user: req.user});
})

export default router;