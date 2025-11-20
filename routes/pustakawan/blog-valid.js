const express = require('express')
const Blog = require('../../models/Blog')
const Pegawai = require('../../models/Pegawai')
const {authPustakawan} = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authPustakawan, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const offset = (page - 1) * limit

        const rows = await Blog.getByStatusAndPegawai('Valid', req.session.pegawaiId, limit, offset)
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const data = rows.map((item) => {
            const dateObj = new Date(item.dibuat_pada)
            const day = dateObj.getDate()
            const month = months[dateObj.getMonth()]
            const year = dateObj.getFullYear()
            const hours = String(dateObj.getHours()).padStart(2, '0')
            const minutes = String(dateObj.getMinutes()).padStart(2, '0')
            const dibuat_pada_display = `${day} ${month} ${year} ${hours}:${minutes}`
            return {
                ...item,
                dibuat_pada_display,
                diverifikasi_oleh_display: item.diverifikasi_oleh || '-'
            }
        })
        const totalData = await Blog.countByStatusAndPegawai('Valid', req.session.pegawaiId)
        const totalHalaman = Math.ceil(totalData / limit)

        res.render('pustakawan/blog/blog-valid/index', {
            data,
            pegawai,
            page,
            totalHalaman
        })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/dashboard')
    }
})

router.get('/:id', authPustakawan, async (req, res) => {
    try {
        const {id} = req.params
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const blog = await Blog.getByIdWithRelations(id, req.session.pegawaiId)

        if (!blog) {
            req.flash('error', 'Blog tidak ditemukan')
            return res.redirect('/pustakawan/blog-valid')
        }

        if (blog.status !== 'Valid') {
            req.flash('error', 'Blog tidak dalam status Valid')
            return res.redirect('/pustakawan/blog-valid')
        }

        res.render('pustakawan/blog/blog-valid/detail', {
            blog,
            pegawai
        })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/pustakawan/blog-valid')
    }
})

module.exports = router

