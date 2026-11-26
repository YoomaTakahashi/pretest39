const express = require('express')
const path = require('path')
const uploadDir = path.join(__dirname,'../uploads/pic_user')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const bc = require('bcrypt')
const db = require('../db')
const {verifyToken,requireRole} = require('../Middleware/authmiddleware')
const router = express.Router()

router.post('/regis',async (req,res) => {
    try {
        const form = JSON.parse(req.body.form)
        const pic_user = req.files?.pic_user
        let filename = null
        if(pic_user){
            filename = Date.now() + path.extname(pic_user.name)
            await pic_user.mv(path.join(uploadDir,filename))
        }
        const hash = await bc.hash(form.password,10)
        const [rows] = await db.query(`insert into tb_member(fname,lname,email,username,password,role,pic_user,statusPw) values(?,?,?,?,?,?,?,'n')`,[form.fname,form.lname,form.email,form.username,hash,form.role,filename])
        res.json(rows)
    } catch (error) {
        console.error("error regis",error);
        res.status(500).json({message:"error regis"})
    }
})

router.post('/login',async (req,res) => {
    try {
        const {username,password,role} = req.body
        const [rows] = await db.query(`select * from tb_member where username=? and role=?`,[username,role])
        const m = rows[0]
        if(!m || !password || !(await bc.compare(password,m.password))){
            return res.status(400).json({message:"รหัสผ่านไม่ถูกต้อง"})
        }
        const token = jwt.sign(
            {id_member:m.id_member,username:m.username,role:m.role},JWT_SECRET,{expiresIn:'24h'}
        )
        const statusPw = m.role === 'ผู้รับการประเมินผล' && m.statusPw === 'n'
        res.json({token,role:m.role,statusPw})
    } catch (error) {
        console.error("error login",error);
        res.status(500).json({message:"error login"})
    }
})


router.put('/changePw',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const {oldPw,newPw} = req.body
        const [rows] = await db.query(`select password from tb_member where id_member=?`,[id_member])
        const m = rows[0]
        if(!m || !oldPw || !(await bc.compare(oldPw,m.password))){
            return res.status(400).json({message:'รหัสผ่านไม่ถูกต้อง'})
        }
        if(oldPw.trim() === newPw.trim()){
            return res.status(400).json({message:'รหัสผ่านต้องไม่ซ้ำกัน'})
        }
        const hash = await bc.hash(newPw,10)
        await db.query(`update tb_member set password=?,statusPw=? where id_member=?`,[hash,'y',id_member])
        res.status(201).json({message:'Update success'})
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"error update"})
    }
})

module.exports = router