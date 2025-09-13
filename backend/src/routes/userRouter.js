import express from 'express';
import userMiddleware from '../middleware/userMiddleware.js'
import {getStores, submitRating, updateRating} from '../controllers/userController.js' 

const router = express.Router();
router.use(userMiddleware);



router.get('/getstores', getStores);
router.post("/ratings", submitRating);   
router.put("/ratings", updateRating);  



export default router;