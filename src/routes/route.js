import express from 'express';
import { AccountControler } from '../controllers/account.controler.js';
import { TransactionControler } from '../controllers/transaction.controler.js';
import { CategoryController } from '../controllers/category.controller.js';


const router = express.Router();


//для счетов
router.get('/accounts', AccountControler.getAccount);
router.get('/accounts/:id', AccountControler.getAccountById);
router.post('/accounts/add', AccountControler.addAccount);
router.delete('/accounts/delete/:id_account', AccountControler.deleteAccount);
router.put('/accounts/edit/:id', AccountControler.editAccount);


//для категорий
router.get('/category/:id_category', CategoryController.getCategoryById);
router.get('/category', CategoryController.getCategories);


//для транзакций
router.get('/transactions/:id_account', TransactionControler.getTransactionsId);
router.get('/transaction/:id', TransactionControler.getTransactionById);
router.put('/transactions/edit/:id', TransactionControler.editTransaction);
router.post('/transactions/add', TransactionControler.addTransaction);
router.delete('/transactions/delete/:id', TransactionControler.deleteTransactions);



export default router;