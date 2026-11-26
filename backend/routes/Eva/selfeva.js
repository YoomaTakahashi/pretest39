const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../uploads/file_eva')

router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member =req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error('Error get',error)
        res.status(500).json({message:'Error Get'})
    }
})

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select* from tb_indicate`)
        const result = topics.map(t=>({
            ...t,indicates:indicates.filter((i)=> i.id_topic === t.id_topic)
        }))
        res.json(result)
    } catch (error) {
        console.error('ERror get',error)
        res.status(500).json({message:'ERror get'})
    }
})

router.post('/save',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const fileMap = {}
        const files = req.files || {}
        const scores = JSON.parse(req.body.scores)
        await Promise(Object.entries(files).map(async ([key,files]) => {
            const filename = Date.now()+Math.random().toString(36).slice(2)+path.extname(file.name)
            await file.mv(path.join(uploadDir,filename))
            fileMap[key] = filename
        }))
        const [[evaRow]] = await db.query(``)
    } catch (error) {
        
    }
})

module.exports = router