import express from 'express'
import { addDoctor, adminDashboard, allDoctors, appointmentCancel, appointmentsAdmin, loginAdmin } from '../controller/AdminController.js'
import upload from '../middleware/Multer.js'
import authAdmin from '../middleware/AuthAdmin.js'
import { changeAvailability } from '../controller/DoctorController.js'

const adminRouter = express.Router()



adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment-admin',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)




export default adminRouter