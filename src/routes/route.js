import express from 'express';
import { AccountControler } from '../controllers/account.controler.js';
import { TransactionControler } from '../controllers/transaction.controler.js';


const router = express.Router();


//для счетов
router.get('/accounts', AccountControler.getAccount);
router.get('/accounts/:id', AccountControler.getAccountById);
router.post('/accounts/add', AccountControler.addAccount);


//для транзакций
router.get('/transactions', TransactionControler.getTransactions);


export default router;