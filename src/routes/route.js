import express from 'express';
import { AccountControler } from '../controllers/account.controler.js';
import { TransactionControler } from '../controllers/transaction.controler.js';
import { CategoryController } from '../controllers/category.controller.js';


const router = express.Router();


//для счетов
router.get('/accounts', AccountControler.getAccount);
router.get('/accounts/:id', AccountControler.getAccountById);
router.post('/accounts/add', AccountControler.addAccount);


//для категорий
router.get('/category/:id_category', CategoryController.getCategoryById);


//для транзакций
router.get('/transactions/:id_account', TransactionControler.getTransactionsId);
router.post('/transactions/add', TransactionControler.addTransaction);



export default router;