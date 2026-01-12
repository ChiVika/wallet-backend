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
            await promisePool.query(`DROP TRIGGER IF EXISTS update_balance`);
            await promisePool.query(update_balance);
            console.log('Триггер добавления транзакции успешно создан');
        } catch (error) {
            console.error('Ошибка при создании триггера:', error.message); 
        }
    }

    static async deleteTransactionTrigger(){
        try{
            const delete_row = `
                CREATE TRIGGER delete_row
                AFTER DELETE ON transaction
                FOR EACH ROW
                BEGIN
                    UPDATE account
                    SET balance = COALESCE(balance, 0) +
                        (SELECT IF(type = 'income', -OLD.amount, OLD.amount)
                        FROM category
                        WHERE id = OLD.category_id)
                    WHERE id = OLD.account_id;
                END
            `
            await promisePool.query(`DROP TRIGGER IF EXISTS delete_row;`)
            await promisePool.query(delete_row);
            console.log('Триггер удаления записи успешно создан');
        }
        catch(error){
            console.log("Триггер удаление транзакции работает неверно", error);
        }
    }


    
}

export { Account, Category, Transaction };