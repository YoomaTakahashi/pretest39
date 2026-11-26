require('dotenv').config({path:".env"})
const cors = require('cors')
const express = require('express')
const fileUp = require('express-fileupload')
const path = require('path')
const app = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

//---------------------------------------------------global api --------------------------------------------------------------------\\

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const auth = require('./routes/auth')
app.use('/api/auth',auth)

//---------------------------------------------------staff api --------------------------------------------------------------------\\

//---------------------------------------------------eva api --------------------------------------------------------------------\\

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

//---------------------------------------------------commit api --------------------------------------------------------------------\\




//---------------------------------------------------endline api --------------------------------------------------------------------\\
app.use((req,res)=> res.status(404).json({message:"Route Not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})