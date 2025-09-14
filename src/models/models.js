import promisePool from "../config/database.js";

class Account{
    static async CreateTable(){
        try{
            const query = `
                CREATE TABLE IF NOT EXISTS account(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    card_number VARCHAR(20) NOT NULL,
                    balance FLOAT,
                    name VARCHAR(100) NOT NULL
                )
            `;
            await promisePool.execute(query);
            console.log('Table "account" created successfully');
        }
        catch(error){
            console.error('Table creation "account" failed');
        }
        
    }
}

class Category{
    static async CreateTable(){
        try{
            const query = `
                CREATE TABLE IF NOT EXISTS category(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    type ENUM('income', 'expense') NOT NULL,
                    name VARCHAR(100) NOT NULL
                )
            `;
            await promisePool.execute(query);
            console.log('Table "category" created successfully');
        }
        catch(error){
            console.error('Table creation "category" failed');
        }
        
    }
}

class Transaction{
    static async CreateTable(){
        try{
            const query = `
                CREATE TABLE IF NOT EXISTS transaction(
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    account_id INT NOT NULL,
                    category_id INT NOT NULL,
                    amount DECIMAL(10, 2) NOT NULL,
                    FOREIGN KEY (account_id) REFERENCES account(id) ON DELETE CASCADE,
                    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
                )
            `;
            await promisePool.execute(query);

            

            console.log('Table "transaction" created successfully');
        }
        catch(error){
            console.error('Table creation "transaction" failed');
        }
    }

    static async createBalanceTrigger() {
        try {
            const update_balance = `
                CREATE TRIGGER update_balance
                AFTER INSERT ON transaction
                FOR EACH ROW
                BEGIN
                    UPDATE account
                    SET balance = COALESCE(balance, 0) +
                        (SELECT IF(type = 'income', NEW.amount, -NEW.amount)
                        FROM category
                        WHERE id = NEW.category_id)
                    WHERE id = NEW.account_id;
                END
            `;
            await promisePool.query(update_balance);
            console.log('Триггер успешно создан');
        } catch (error) {
            console.error('Ошибка при создании триггера:', error.message); 
        }
    }

    
}

export { Account, Category, Transaction };