import promisePool from "../config/database.js";

class AccountControler{
    static async getAccount(req, res){
        try{
            const [rows] =  await promisePool.execute(`
                SELECT * FROM account 
            `)
            
            res.status(200).json({
                success: true,
                count: rows.length,
                data: rows
            });

        }
        catch(error){
            console.error('Error getting accounts: ', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении счетов',
                error: error.message
            })
        }
    }

    static async getAccountById(req, res){
        try{
            const {id} = req.params
            const [rows] = await promisePool.execute(`
                SELECT * FROM account WHERE id = ?`,
                [id]

            );

            if(rows.length === 0){
                return res.status(404).json({
                    success: false,
                    message: `Счет с id: ${id} не найден`
                });
            }
            res.status(200).json({
                success: true,
                data: rows[0]
            });
        }
        catch(error){
            console.log(`Error getting account ${id}`)
            res.status(500).json({
                success: false,
                message: `Ошибка получения счета с id: ${id}`,
                error: error.message
            })
        }
    }
    static async addAccount(req, res){
        try {
            const {card_number, balance, name} = req.body;

            if (!card_number || !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Номер карты и название обязательны'
                });
            }

            const safeBalance = balance !== '' ? balance : 0;
            const safeName = name || '';

            const [rows] = await promisePool.execute(`
                INSERT INTO account (card_number, balance, name) VALUES (?, ?, ?)
            `, [card_number, safeBalance, safeName])


            res.status(201).json({
                success: true,
                message: 'Счет успешно создан',
                data: rows[0] 
            });
            
        } catch (error) {
            console.error('Error creating account:', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка создания счета',
                error: error.message
            })
        }
    }

    static async deleteAccount(req, res){
        try{
            const {id_account} = req.params;
            await promisePool.execute(`
                DELETE FROM account WHERE id = ?
            `, [id_account])
            res.status(201).json({
                success: true,
                message: 'Счет успешно удален',
            });
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: 'Ошибка удаления счета',
                error: error.message
            })
        }
    }

    static async editAccount(req, res){
        try{
            const {card_number, name, balance} = req.body;
            const id = req.params.id;

            const [currentAccounts] = await promisePool.execute(`
                SELECT * FROM account WHERE id = ?
            `, [id]);
            console.log(currentAccounts[0]);
            await promisePool.execute(`
                UPDATE account 
                SET card_number = ?, name = ?, balance = ?
                WHERE id = ?
            `, [card_number, name, balance, id]);
            res.status(201).json({
                success: true,
                message: `Счет под номером ${id} успешно обновлен`
            });
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: 'Ошибка при редактировании счета',
                error: error.message
            });
        }
    }
}
export {AccountControler}