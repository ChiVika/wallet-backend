import promisePool from "../config/database.js";

class TransactionControler{
    static async getTransactions(req, res){
        try{
            const [rows] = await promisePool.execute(`
                SELECT * FROM transaction
            `)
            res.status(200).json({
                success: true,
                count: rows.length,
                data: rows
            })

        }
        catch(error){
            console.error('Error getting transactions: ', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении данных',
                error: error.message
            })
        }

    }
        
}

export {TransactionControler}
