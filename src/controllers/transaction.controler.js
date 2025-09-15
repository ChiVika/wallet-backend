import promisePool from "../config/database.js";

class TransactionControler{
    static async getTransactionsId(req, res){
        const { id_account } = req.params;
        try {
            const [rows] = await promisePool.execute(`
                SELECT 
                    t.id, 
                    t.account_id, 
                    t.amount, 
                    c.name as category_name, 
                    c.type as category_type
                FROM transaction t
                LEFT JOIN category c ON t.category_id = c.id 
                WHERE t.account_id = ?
            `, [id_account]);

            res.status(200).json({
                success: true,
                count: rows.length,
                data: rows
            });
        } catch(error) {
            console.error('Error getting transactions: ', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных',
                error: error.message
            });
        }

    }

    static async addTransaction(req,res){
        try{
            const {account_id, category_type, category_name, amount} = req.body;
            let category_id;
        
            const [existingCategory] = await promisePool.execute(
                `SELECT id FROM category WHERE name = ? AND type = ?`,
                [category_name, category_type]
            );

            if (existingCategory.length > 0) {
                category_id = existingCategory[0].id;
            } else {
                const [newCategory] = await promisePool.execute(
                    `INSERT INTO category (name, type) VALUES (?, ?)`,
                    [category_name, category_type]
                );
                category_id = newCategory.insertId;
            }

            const [categoryRows] = await promisePool.execute(`
                    SELECT type FROM category WHERE id = ?`
            ,[category_id])

            const type = categoryRows[0].type;

            if(type === 'expense'){
                const [account] = await promisePool.execute(`
                    SELECT balance FROM account WHERE id = ?
                `, [account_id])
                const currentBalance = account[0].balance || 0;
                if (currentBalance < amount) {
                    throw new Error('Недостаточно средств на счете');
                }
            }

            const [result] = await promisePool.execute(`
                INSERT INTO transaction (account_id, category_id, amount) VALUES (?, ?, ?)
            `, [account_id, category_id, amount])


            res.status(201).json({
                success: true,
                message: 'Счет успешно создан'
            });


        }
        catch(error){
            console.error('Error created transactions: ', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при создании транзакции',
                error: error.message
            });

        }
    }
        
}

export {TransactionControler}
