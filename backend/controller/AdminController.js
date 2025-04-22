import validator from "validator"
import argon2 from 'argon2'
import {v2 as cloudinary} from 'cloudinary'
import DoctorModel from "../models/DoctorModel.js"
import jwt from 'jsonwebtoken'
import doctorModel from "../models/DoctorModel.js"
import appointmentModel from "../models/AppointmentModel.js"
import userModel from "../models/UserModel.js"

//api for adding doctor
const addDoctor = async (req,res) => {

  try {
      
      const { name, email, password, specialty, degree, experience, about, fees, address} = req.body
      const imageFile = req.file
      
      // Checking for all data to add doctor
      if (!name || !email|| !password || !specialty || !degree || !experience || !about || !fees || !address) {
        return res.json({success:false, message:"Missing Details"})
      }

      // Validating email format
      if (!validator.isEmail(email)) {
        return res.json({success:false, message:"Please put a valid email"})
      }

      // Validating strong password
      if (password.length < 8) {
        return res.json({success:false, message:"Please enter a strong password"})
      }

      // Hashing doctor password
      const hashedPassword = await argon2.hash(password);
 
      // upload image in cloudinary
      const imageUpload =  await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
      const imageUrl = imageUpload.secure_url

      const doctorData = {
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        specialty,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
      }

      const newDoctor = new DoctorModel(doctorData)
      await newDoctor.save()

      res.json({success:true, message:"Doctor Added"})

  } catch (error) {
      console.log(error)
      res.json({success:false, message:"Server Error"})
  }
}

// API for admin login
const loginAdmin = async (req,res) => {
  try {

    const {email, password} = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

       const token = jwt.sign(email+password,process.env.JWT_SECRET)
       res.json({success:true, token})
      
    } else {
       res.json({success:false, message:"Invalid Credentials"})
    }
    
  } catch (error) {
     console.log(error)
     res.json({success:false, message:"Server Error"})
  }
}

// API to get all doctor's list for admin panel
const allDoctors = async (req,res) =>{
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.status(200).json({success:true,doctors})

    
  }catch (error){
    console.log(error)
    res.status(400).json({success:false,message:error.message})
  }
}

// API to get all appointment list
const appointmentsAdmin = async (req,res) => {

  try {
    
    const appointments = await appointmentModel.find({})
      res.json({success: true, appointments})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }

}

// API cancel appointment in admin
 const appointmentCancel = async (req,res) => {

    try {
      
      const { appointmentId } = req.body
      const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

      // Removing doctor slot record if cancelled
        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true,message:'Appointment cancelled'})

    } catch (error) {
      console.log(error)
      res.json({success:false, message: error.message})
    }
  }

// API show data on dashboard from admin panel
const adminDashboard = async (req,res) => {

  try {
    
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success: true, dashData})

  } catch (error) {
     console.log(error)
      res.json({success:false, message: error.message})
  }

}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}