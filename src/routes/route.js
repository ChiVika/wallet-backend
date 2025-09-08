import express from 'express';
import { AccountControler } from '../controllers/account.controler.js';


const router = express.Router();

router.get('/accounts', AccountControler.getAccount);
router.get('/accounts/:id', AccountControler.getAccountById);
router.post('/accounts/add', AccountControler.addAccount);

export default router;