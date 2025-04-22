/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { AppContext } from "../context/AppContext"
import axios from 'axios'
import {toast} from 'react-toastify'


const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext)

  const [appointments,setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointments = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + '/api/user/appointments', {headers:{token}})
      if (data.success) {
        setAppointments(data.appointments)
        console.log(data.appointments)
        
      }

    } catch (error) {
      console.log();
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {

    try {

      // console.log(appointmentId)
      const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment', {appointmentId}, {headers:{token}})
        if (data.success) {
          toast.success(data.message)
          getUserAppointments()
          getDoctorsData()
          
        } else {
          toast.error(data.message)
        }
      
      
    } catch (error) {
      console.log();
      toast.error(error.message)
    }

  }


  const appointmentStripe = async (appointmentId) => {
    try {
      // Send appointmentId to your backend to create Stripe checkout session
      const { data } = await axios.post(`${backendUrl}/api/user/payment-stripe`, { appointmentId }, { headers: { token } })
      
      if (data.success && data.url) {
        // Store session ID and appointment ID for verification after redirect
        localStorage.setItem('pendingStripeSession', JSON.stringify({
          sessionUrl: data.url
        }))

        // ✅ Redirect the user to Stripe Checkout
        window.location.href = data.url
      } else {
        toast.error(data.message || "Failed to create payment session.")
      }
    } catch (error) {
      console.error("Stripe payment error:", error)
      toast.error("Something went wrong during payment.")
    }
  }
  

 
    const verifyPayment = async () => {
      const sessionId = new URLSearchParams(window.location.search).get("session_id")
  
      if (sessionId) {
        try {
          const { data } = await axios.post(`${backendUrl}/api/user/verify-payment`, { sessionId }, {headers: { token },
          })
  
          if (data.success) {
            toast.success("Payment verified!")
            getUserAppointments(); // Update UI to show 'Paid'
            window.history.replaceState(null, null, '/my-appointments') // remove session_id from URL
          }
        } catch (error) {
          console.log(error)
          toast.error("Payment verification failed")
        }
      }
    }
  
  useEffect(() => {
    if (token) {
      verifyPayment()
    }
  }, [token]);


  useEffect(() => {
    if (token) {
      getUserAppointments()
      
    }
  },[token])

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointment</p>
      <div>
        {appointments.map((item,index)=> (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={index}>
            <div>
              <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
              <p>{item.docData.specialty}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-sm">{item.docData.address.line1}</p>
              <p className="text-sm">{item.docData.address.line2}</p>
              <p className="text-xs mt-1"><span className="text-sm text-neutral-700 font-medium">Date & Time:</span>  {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && <button className="sm: min-w-48 py-2 border rounded text-stone-500 bg-indigo-50 transition-none">Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentStripe(item._id)} className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300">Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className="text-sm text-stone-600 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300">Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>}
              {item.isCompleted && <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
