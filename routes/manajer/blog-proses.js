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

        const data = await Blog.getByStatusAndPegawai('Proses', req.session.pegawaiId, limit, offset)
        const totalData = await Blog.countByStatusAndPegawai('Proses', req.session.pegawaiId)
        const totalHalaman = Math.ceil(totalData / limit)

        res.render('manajer/blog/blog-proses/index', {
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
            return res.redirect('/manajer/blog-proses')
        }

        if (blog.status !== 'Proses') {
            req.flash('error', 'Blog tidak dalam status Proses')
            return res.redirect('/manajer/blog-proses')
        }

        blog.foto_cover = Blog.normalizeImagePath(blog.foto_cover)

        res.render('manajer/blog/blog-proses/detail', {
            blog,
            pegawai
        })
    } catch (err) {
        console.error(err)
        req.flash('error', "Internal Server Error")
        return res.redirect('/manajer/blog-proses')
    }
})

module.exports = router

