// UserController
import axios from 'axios';
import appointmentModel from '../models/AppointmentModel.js'; // Assuming you have a model for appointments

const paymaya = axios.create({
  baseURL: 'https://pgapi.paymaya.com/checkout/v1', // Maya's API base URL
  headers: {
    'Authorization': `Basic ${process.env.PAYMAYA_API_KEY}`, // Your Maya API key
    'Content-Type': 'application/json',
  },
});

// API to start payment
const initiatePayment = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;  // You would pass the appointment ID and payment amount

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    // Create payment request in PayMaya
    const paymentRequest = {
      totalAmount: {
        currency: 'PHP',
        amount: amount,
      },
      redirectUrl: {
        success: `${process.env.PAYMENT_SUCCESS_URL}/${appointmentId}`,  // Redirect URL on successful payment
        failure: `${process.env.PAYMENT_FAILURE_URL}/${appointmentId}`,  // Redirect URL on failed payment
        cancel: `${process.env.PAYMENT_CANCEL_URL}/${appointmentId}`,   // Redirect URL on cancelled payment
      },
    };

    const response = await paymaya.post('/checkouts', paymentRequest);

    // Store the payment reference in the appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, { paymentReference: response.data.paymentReference });

    // Return the payment link (URL) to redirect the user to PayMaya's payment page
    res.json({ success: true, paymentUrl: response.data.redirectUrl });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify payment status
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body; // The appointment ID

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: 'Appointment cancelled or not found' });
    }

    // Check if payment was successful
    const paymentStatus = await paymaya.get(`/checkouts/${appointmentData.paymentReference}`);

    if (paymentStatus.data.status === 'PAID') {
      // Update appointment as paid
      await appointmentModel.findByIdAndUpdate(appointmentId, { paymentStatus: 'PAID', isCompleted: true });
      res.json({ success: true, message: 'Payment successful and appointment confirmed' });
    } else {
      res.json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { initiatePayment, verifyPayment };



// Router
import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, initiatePayment, verifyPayment } from '../controller/UserController.js'



const router = express.Router();

// Route to initiate payment for appointment
router.post('/pay-appointment',authUser, initiatePayment);

// Route to verify payment after redirection from PayMaya
router.post('/verify-payment',authUser, verifyPayment);

export default router;


//Server.js
import paymentRouter from './routes/paymentRoutes.js'; //
app.use('/api/payment', paymentRouter); // Include the payment routes

//ENV
PAYMAYA_API_KEY=your_maya_api_key
PAYMENT_SUCCESS_URL=http://yourdomain.com/payment-success
PAYMENT_FAILURE_URL=http://yourdomain.com/payment-failure
PAYMENT_CANCEL_URL=http://yourdomain.com/payment-cancelled