import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/AdminRoute.js'
import doctorRouter from './routes/DoctorRoute.js'
import userRouter from './routes/UserRoute.js'


//app config
const app = express()
connectDB()
connectCloudinary()

// middleware
app.use(express.json())
app.use(cors())

//app endpoint
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/api/status',(req,res)=>{
    res.send("API WORKING")
})

// add if statement for vercel
if (process.env.NODE_EV !== "production") {
    const port = process.env.PORT || 4000
    app.listen(port, ()=> console.log("server is running on PORT: ", + port))
}

// Export server for vercel
export default server;