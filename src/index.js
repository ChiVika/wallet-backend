import express from "express";
import router from "./routes/route.js";
import cors from "cors";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));

app.use('/api', router);


app.get('/', (request, response) => {
    response.json({
        endpoins: {
            account: '/api/accounts',
            accountById: '/api/accounts/:id',
            accountAdd: '/api/accounts/add',
            transaction: '/api/transactions/:id_account',
            transactionById: '/api/transaction/:id',
            transactionAdd: '/api/transactions/add',
            editTransaction: '/api/transactions/edit/:id',
            transactionDelete: '/api/transactions/delete/:id',
            categoryById: '/api/category/:id_category',
            categories: '/api/category',
            deleteAccount: '/accounts/delete/:id_account'
        }
    })
})

app.listen(PORT, () => {
    console.log('server started!');
})