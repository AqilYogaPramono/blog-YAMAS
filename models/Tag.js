const connection = require('../configs/database')

class Tag {
    static async getAll() {
        try {
            const [rows] = await connection.query(`SELECT * FROM tag ORDER BY id ASC`)
            return rows
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query(`INSERT INTO tag SET ?`, [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async update(data, id) {
        try {
            const [result] = await connection.query(`UPDATE tag SET ? WHERE id = ?`, [data, id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async getById(id) {
        try {
            const [rows] = await connection.query(`SELECT * FROM tag WHERE id = ?`, [id])
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async delete(id) {
        try {
            const [result] = await connection.query(`DELETE FROM tag WHERE id = ?`, [id])
            return result
        } catch (err) {
            throw err
        }
    }

    static async checkTagCreate(data) {
        try {
            const [rows] = await connection.query(`SELECT nama_tag FROM tag WHERE nama_tag = ?`, [data.nama_tag])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }

    static async checkTagUpdate(data, id) {
        try {
            const [rows] = await connection.query(`SELECT nama_tag FROM tag WHERE nama_tag = ? AND id != ?`, [data.nama_tag, id])
            return rows.length > 0
        } catch (err) {
            throw err
        }
    }
}

module.exports = Tag
