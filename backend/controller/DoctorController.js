import doctorModel from "../models/DoctorModel.js"
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/AppointmentModel.js"

const changeAvailability = async (req,res) =>{
   try {
    const {docId} = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
    res.status(200).json({success:true,message: 'Availability Change'})

   } catch (error) {
    console.log(error)
    res.status(400).json({success:false,message:error.message})
   }
}

const doctorList = async (req,res) =>{
  try {
   const doctors = await doctorModel.find({}).select(['-password','-email'])
   res.status(200).json({success:true,doctors})
  } catch (error) {
   console.log(error)
    res.status(400).json({success:false,message:error.message})
  }
}

// API for doctor Login
const loginDoctor = async (req,res) => {

  try {

    const { email, password} = req.body
    const doctor = await doctorModel.findOne({email})

    if (!doctor) {
      return res.json({success: false, message:'Invalid Credential'})
      
    }
    
    const isMatch = await argon2.verify(doctor.password, password)
      if (isMatch) {

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
        res.json({success: true, token})
        
      } else {
        res.json({success: false, message:'Invalid Credential'})
      }
    
  } catch (error) {
    console.log(error)
    res.status(400).json({success:false,message:error.message})
  }

}

//API to get doctor appointments in doctor panel
const appointmentsDoctor = async (req,res) => {

  try {
    
    const {docId} = req.body
    const appointments = await appointmentModel.find({ docId })
    
    res.json({success:true,appointments})

  } catch (error) {
    console.log(error)
    res.status(400).json({success:false,message:error.message})
  }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req,res) => {

  try {
    
    const {docId, appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

      if (appointmentData && appointmentData.docId === docId) {

        await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
        return res.json({success: true, message: 'Appointment Completed'})
        
      } else {
        return res.json({success: false, message:'Mark Failed'})
      }

  } catch (error) {
     console.log(error)
    res.json({success:false,message:error.message})
  }

}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req,res) => {

  try {
    
    const {docId, appointmentId} = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

      if (appointmentData && appointmentData.docId === docId) {

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
        return res.json({success: true, message: 'Appointment Cancelled'})
        
      } else {
        return res.json({success: false, message:'Cancel Failed'})
      }

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }

}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req,res) => {

  try {

    const {docId} = req.body
    const appointments = await appointmentModel.find({docId})
    
    let earnings = 0

    appointments.map((item) =>{
      if (item.isCompleted || item.payment) {
         earnings += item.amount
        
      }
    })

    let patients = []

    appointments.map((item) =>{
      if (!patients.includes(item.userId)) {
          patients.push(item.userId)
      }
    })

    const dashData =  {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success: true, dashData})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
// API to get doctor profile for doctor panel
const doctorProfile = async (req,res) => {

  try {
    
    const {docId} = req.body
    const profileData = await doctorModel.findById(docId).select('-password')
    
    res.json({success: true, profileData})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req,res) => {

  try {

    const {docId, fees, address, available} = req.body
    
    await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

    res.json({success: true, message: 'Profile Updated'})
    
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}
export {changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, updateDoctorProfile, doctorProfile} 