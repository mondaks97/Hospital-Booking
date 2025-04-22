 import stripe from "stripe"
 import appointmentModel from '../models/AppointmentModel.js'
 import {  useEffect } from "react"
 import axios from 'axios'
 import {toast} from 'react-toastify'
 
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


export {paymentStripe, verifyStripe}

// ✅ This will now redirect users with a real session_id Stripe gives you.


// put it on any MyAppointment jsx file

  // Function to verify Stripe payment after redirect
  const verifyPayment = async () => {
    // Get the session ID from the URL
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    // If session ID exists (i.e., user was redirected back from Stripe)
    if (sessionId) {
      try {
        // Send session ID to backend for verification
        const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, { sessionId }, {
          headers: { token }, // Include token for authentication
        });

        // If verification was successful, update UI
        if (data.success) {
          toast.success("Payment verified!");
          getUserAppointments(); // Fetch updated appointment status
          window.history.replaceState(null, null, '/my-appointments'); // Remove session_id from URL
        }
      } catch (err) {
        toast.error("Payment verification failed");
      }
    }
  };

  useEffect(() => {
  // Run the verification and fetch appointments when token is available
  if (token) {
    verifyPayment();
    getUserAppointments(); // Fetch appointments if token exists
  }
}, [token]); // Run when token changes
