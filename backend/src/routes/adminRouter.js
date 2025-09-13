import express from 'express';
import adminMiddleware from '../middleware/adminMiddleware.js'

import {addUser, addAdmin, changeRole, getAdminDashboard, addStore, getAllStores, getAllUsers} from '../controllers/adminController.js' 

const router = express.Router();
router.use(adminMiddleware);

router.post('/addstore', addStore);
router.post('/adduser', addUser);
router.post('/addadmin', addAdmin);
router.get('/dashboard', getAdminDashboard);

router.get('/allstores', getAllStores);
router.patch('/change-role', changeRole);

router.get('/users', getAllUsers)



export default router;