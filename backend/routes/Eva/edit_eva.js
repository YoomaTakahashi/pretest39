const express = require('express')
const bc = require('bcrypt')
const db = require('../../db')
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')
const router = express.Router()
const crypto = require('crypto')



router.put('/update/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const {fname,lname,email,username,password,role} = req.body
        if(password && password.trim()){
            const hash = await bc.hash(password,10)
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,password=?,role=? where id_member=?`,[fname,lname,email,username,hash,role,id_member])
            res.json({rows,message:"update success"})
        }else{
            const [rows] = await db.query(`update tb_member set fname=?,lname=?,email=?,username=?,role=? where id_member=?`,[fname,lname,email,username,role,id_member])
            res.json({rows,message:"update success"})
        }
        
    } catch (error) {
        console.error("error update",error);
        res.status(500).json({message:"error update"})
    }
})





router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member

        const [rows] = await db.query(`select fname,lname,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])

        
    } catch (error) {
        console.error("error get",error);
        res.status(500).json({message:"error get"})
    }
})





module.exports = router