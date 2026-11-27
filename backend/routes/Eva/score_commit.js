const express = require('express')
const db = require('../../db')
const router = express.Router()
const {verifyToken,requireRole} = require('../../Middleware/authmiddleware')


router.get('/commit',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member =req.user.id_member
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        const id_eva = evaRow.id_eva
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member,id_eva])
        res.json(rows)
    } catch (error) {
        console.error('Error get',error)
        res.status(500).json({message:'Error Get'})
    }
})

router.get('/scores',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member =req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,[id_member])
        const id_eva = evaRow.id_eva
        const [rows] = await db.query(`select* from tb_indicate i,tb_evadetail d where i.id_indicate=d.id_indicate and status_eva in (2,3,4) and d.id_eva=?`,[id_eva])
        const scores = {}
        rows.map(row=>{
            const id_indicate = row.id_indicate
            const point_indicate = row.point_indicate
            const status_eva = row.status_eva
            const score_commit = row.score_commit
            if(scores[id_indicate]){
                scores[id_indicate]={
                    a:null,
                    b:null,
                    c:null,
                }
            }
            if(status === 2)scores[id_indicate].a = score_commit*point_indicate
            if(status === 3)scores[id_indicate].b = score_commit*point_indicate
            if(status === 4)scores[id_indicate].c = score_commit*point_indicate
        })
        res.json(scores)
    } catch (error) {
        console.error('ERror get',error)
        res.status(500).json({message:'ERror get'})
    }
})

module.exports = router