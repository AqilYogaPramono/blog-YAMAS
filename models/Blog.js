const connection = require('../configs/database')

class Blog {
    static async countAllBlogValid() {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_valid FROM blog WHERE status = ?',
                ['Valid']
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countAllBlogTidakValid() {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_tidak_valid FROM blog WHERE status = ?',
                ['Tidak Valid']
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countAllBlogProses() {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_proses FROM blog WHERE status = ?',
                ['Proses']
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countBlogValidByPegawai(pegawai) {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_valid FROM blog WHERE status = ? AND nama_pembuat = ?',
                ['Valid', pegawai.nama]
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countAllBlogTidakValidByPegawai(pegawai) {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_tidak_valid FROM blog WHERE status = ? AND nama_pembuat = ?',
                ['Tidak Valid', pegawai.nama]
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async countAllBlogProsesByPegawai(pegawai) {
        try {
            const [rows] = await connection.query(
                'SELECT COUNT(id) AS count_all_proses FROM blog WHERE status = ? AND nama_pembuat = ?',
                ['Proses', pegawai.nama]
            )
            return rows[0]
        } catch (err) {
            throw err
        }
    }

    static async generateTautan(judul) {
        try {
            let baseTautan = judul
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()

            let tautan = baseTautan
            let counter = 1

            while (true) {
                const [rows] = await connection.query(
                    'SELECT id FROM blog WHERE tautan = ?',
                    [tautan]
                )

                if (rows.length === 0) {
                    break
                }

                tautan = `${baseTautan}-${counter}`
                counter++
            }

            return tautan
        } catch (err) {
            throw err
        }
    }

    static async store(data) {
        try {
            const [result] = await connection.query('INSERT INTO blog SET ?', [data])
            return result
        } catch (err) {
            throw err
        }
    }

    static async storeTagBlog(idBlog, idTag) {
        try {
            await connection.query(
                'INSERT INTO tag_blog (id_blog, id_tag) VALUES (?, ?)',
                [idBlog, idTag]
            )
        } catch (err) {
            throw err
        }
    }

    static async storeKategoriBlog(idBlog, idKategori) {
        try {
            await connection.query(
                'INSERT INTO kategori_blog (id_blog, id_kategori) VALUES (?, ?)',
                [idBlog, idKategori]
            )
        } catch (err) {
            throw err
        }
    }

    static async storeSumber(idBlog, namaSumber) {
        try {
            await connection.query(
                'INSERT INTO sumber (id_blog, nama_sumber) VALUES (?, ?)',
                [idBlog, namaSumber]
            )
        } catch (err) {
            throw err
        }
    }
}

module.exports = Blog
