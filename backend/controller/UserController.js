import validator from 'validator'
import argon2 from 'argon2'
import userModel from '../models/UserModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/DoctorModel.js'
import appointmentModel from '../models/AppointmentModel.js'
import Stripe from 'stripe'

// API TO REGISTER USER 
const registerUser = async (req, res) => {

  try {
    const { name, email, password } = req.body

    if (!name || !password || !email) {
      return res.status(400).json({ success: false, message: "Missing Details" })

    }

    //Validating Email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a Valid Email" })

    }

    // Validating Strong Password
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Enter a Strong Password" })

    }

    // Hashing User Password
    const hashedPassword = await argon2.hash(password);

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.status(200).json({ success: true, token })

  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })

  }
}

// API for user login
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' })

    }

    const isMatch = await argon2.verify(user.password, password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.status(200).json({ success: true, token })

    } else {
      res.status(400).json({ success: false, message: "Invalid credentials" })
    }


  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

// API to get user profile data
const getProfile = async (req, res) => {

  try {

    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')

    res.json({ success: true, userData })

  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
}

//API to update user profile
const updateProfile = async (req, res) => {

  try {

    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !address || !dob || !gender) {

      return res.json({ success: false, message: "Data Missing" })

    }

    await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

    if (imageFile) {

      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL = imageUpload.secure_url

      await userModel.findByIdAndUpdate(userId,{image:imageURL})
      
    }

    res.json({success:true,message:"Profile Updated"})


  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message })
  }
}


// API to book appointment
const bookAppointment = async (req,res) => {
   
  try {
    
    const {userId, docId, slotDate, slotTime} = req.body

    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {

      return res.json({success:false,message:'Doctor Not Available'})
      
    }

    let slots_booked = docData.slots_booked

    // Checking for slots availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({success:false,message:'Slot Not Available'})

      } else {
        slots_booked[slotDate].push(slotTime)
      }
      
    } else {
      slots_booked[slotDate] = []
      slots_booked[slotDate].push(slotTime)
    }

    const userData = await userModel.findById(userId).select('-password')

    delete docData.slots_booked

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date:Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()


  // Save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})

    res.status(200).json({success:true,message:'Appointment Booked'})


  } catch (error) {
    console.log(error)
    res.json({success:false, message: error.message})
    
  }
}

// API to get user appointments to front-end my appointment page
  const listAppointment = async (req,res) => {

    try {
        
      const {userId} = req.body
      const appointments = await appointmentModel.find({userId})

      res.json({success:true,appointments})

    } catch (error) {
      console.log(error)
      res.json({success:false, message: error.message})
    }
  }


// API to cancel appointment
  const cancelAppointment = async (req,res) => {

    try {
      
      const {userId, appointmentId} = req.body
      const appointmentData = await appointmentModel.findById(appointmentId)

      //verify appointment user
        if (appointmentData.userId !== userId) {
            return res.json({success:false,message:'Unauthorize action'})
          
        }

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

  const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)


// API for payment method using stripe
  const paymentStripe = async (req,res) => {
       
    const frontend_url = "http://localhost:5173"

    try {
      
      // Get the appointment ID from the request body
      const { appointmentId, email } = req.body

      // Find the appointment by ID in the database
      const appointmentData = await appointmentModel.findById(appointmentId)

       // Check if the appointment exists or has been cancelled
      if(!appointmentData || appointmentData.cancelled) {
          return res.json({success:false,message:'Appointment cancelled or not found'})
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: process.env.CURRENCY,
              product_data: {
                name:`Appointment with ${appointmentData.docData.name}`,
              },
              unit_amount: appointmentData.amount * 100,
            },
            quantity: 1,
          },
        ],

        mode: 'payment',
        customer_email: email,
        success_url: `${frontend_url}/my-appointments?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontend_url}/my-appointments`,
        metadata: {
          appointmentId: appointmentData._id.toString(),
        },
      })

      //Send the Stripe Checkout session URL to frontend
      res.json({ success: true, url: session.url})
      

    } catch (error) {
      console.log(error)
      res.json({success:false, message: error.message})
    }
  }



// API to verify Stripe payment after redirection from Checkout
const verifyStripe = async (req, res) => {
  try {
    const { sessionId } = req.body; // Get session ID from frontend request

    // Retrieve the Stripe session using the session ID
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the payment was successful
    if (session.payment_status === 'paid') {
      // Update the appointment's payment status to true
      const appointmentId = session.metadata.appointmentId;
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });

      // Respond with success
      return res.json({ success: true });
    } else {
      // Respond if the payment wasn't completed
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Stripe verification error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentStripe, verifyStripe } 