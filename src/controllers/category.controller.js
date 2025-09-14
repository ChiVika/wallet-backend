import promisePool from "../config/database.js";

class CategoryController{
    static async getCategoryById(req, res){
        const {id_category} = req.params
        console.log('id: ', id_category)
        try{
            const [rows] = await promisePool.execute(
                `SELECT * FROM category WHERE id = ?`,
                [id_category]
            )
            res.status(200).json({
                success: true,
                count: rows.length,
                data: rows[0]
            })
        }
        catch(error){
            console.error('Error getting category by id: ', error);
            res.status(500).json({
                success: false,
                message: 'Ошибка при получении категории',
                error: error.message
            })
        }
    }
}

export {CategoryController}