const express = require('express')
const Blog = require('../../models/Blog')
const Pegawai = require('../../models/Pegawai')
const { authManajer } = require('../../middlewares/auth')

const router = express.Router()

router.get('/', authManajer, async (req, res) => {
    try {
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const page = parseInt(req.query.page) || 1
        const limit = 20
        const offset = (page - 1) * limit

        const rows = await Blog.getByStatusAndPegawai('Tidak-Valid', req.session.pegawaiId, limit, offset)
        const data = rows.map((item) => ({
            ...item,
            dibuat_pada_display: new Date(item.dibuat_pada).toLocaleString('id-ID'),
            diverifikasi_oleh_display: item.diverifikasi_oleh || '-'
        }))
        const totalData = await Blog.countByStatusAndPegawai('Tidak-Valid', req.session.pegawaiId)
        const totalHalaman = Math.ceil(totalData / limit)

        res.render('manajer/blog/blog-tidak-valid/index', {
            data,
            pegawai,
            page,
            totalHalaman
        })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/manajer/dashboard')
    }
})

router.get('/:id', authManajer, async (req, res) => {
    try {
        const {id} = req.params
        const pegawai = await Pegawai.getNama(req.session.pegawaiId)
        const blog = await Blog.getByIdWithRelations(id, req.session.pegawaiId)

        if (!blog) {
            req.flash('error', 'Blog tidak ditemukan')
            return res.redirect('/manajer/blog-tidak-valid')
        }

        if (blog.status !== 'Tidak-Valid') {
            req.flash('error', 'Blog tidak dalam status Tidak Valid')
            return res.redirect('/manajer/blog-tidak-valid')
        }

        blog.foto_cover = Blog.normalizeImagePath(blog.foto_cover)

        res.render('manajer/blog/blog-tidak-valid/detail', {
            blog,
            pegawai
        })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/manajer/blog-tidak-valid')
    }
})

module.exports = router

