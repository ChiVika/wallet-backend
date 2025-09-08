import promisePool from "../src/config/database.js";
import { Account, Category, Transaction } from "../src/models/models.js";

async function runMigration() {
    let connection;
    try{
        connection = await promisePool.getConnection();
        console.log('starting migration...');

        await Account.CreateTable();
        await Category.CreateTable();
        await Transaction.CreateTable();

        console.log('Database initialized successfully!');
    }
    catch(error){
        console.error('Database initialized failed!');
    }
}

runMigration();
