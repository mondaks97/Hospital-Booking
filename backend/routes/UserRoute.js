import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe } from '../controller/UserController.js'
import authUser from '../middleware/AuthUser.js'
import upload from '../middleware/Multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment',authUser, bookAppointment)
userRouter.get('/appointments',authUser, listAppointment)
userRouter.post('/cancel-appointment',authUser, cancelAppointment)
userRouter.post('/payment-stripe',authUser, paymentStripe)
userRouter.post('/verify-payment',authUser, verifyStripe)







export default userRouter