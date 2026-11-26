const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const db = require('../db')

exports.verifyToken = (req,res,next)=>{
    const authHeader = req.header("Authorization")
    if(!authHeader){
        return res.status(401).json({message:"Authorization header is required"})
    }
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:'Provice Token'})
    }
    const token = authHeader.split(" ")[1]
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error('INVALID TOKEN',error)
        res.status(401).json({message:'Invalid Token'})
    }
}

exports.requireRole = (role)=>(req,res,next)=>{
    try {
        if(req.user && req.user.role === role){
            return next()
        }
        res.status(401).json({message:"Role is Not define"})
    } catch (error) {
        console.error('Role is Not define',error)
        res.status(401).json({message:'Role is Not define'})
    }
}

exports.reqchangePw = async (req,res,next) => {
    try {
        const id_member =req.user.id_member
        const role = req.user.role
        if(role !== 'ผู้รับการประเมินตนเอง')return
        const [rows] = await db.query(`select statusPw from tb_member where id_member=?`,[id_member])
        if(rows[0]?.statusPw === 'n'){
            return res.status(403).json({message:'กรุณาเปลี่ยนรหัสผ่านก่อน',statusPw:true})
        }
        next()
    } catch (error) {
        console.error('Error check Password',error)
        res.status(500).json({message:'Error check Password'})
    }
}