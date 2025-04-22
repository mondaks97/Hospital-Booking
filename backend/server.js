import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloundinary from './config/cloudinary.js'
import adminRouter from './routes/AdminRoute.js'
import doctorRouter from './routes/DoctorRoute.js'
import userRouter from './routes/UserRoute.js'


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloundinary()

// middleware
app.use(express.json())
app.use(cors())

//app endpoint
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=> console.log("server started", port))