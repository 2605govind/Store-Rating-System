import express from 'express';
import storeOwnerMiddleware from '../middleware/storeOwnerMiddleware.js'
import {getAverageRating, getUsersWhoRatedStore} from '../controllers/storeOwnerController.js' 

const router = express.Router();
router.use(storeOwnerMiddleware);


router.get('/average-rating', getAverageRating);
router.get("/store-ratings", getUsersWhoRatedStore);   


export default router;