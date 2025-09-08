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
            accountAdd: '/api/accounts/add'
        }
    })
})

app.listen(PORT, () => {
    console.log('server started!');
})