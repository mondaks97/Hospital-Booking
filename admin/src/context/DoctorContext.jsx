/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext = createContext()

// This step solve the "Could not Fast Refresh ("(name of context)Context" export is incompatible)" error for Context.
// Put export beside "const DoctorContextProvider = ({children})" and remove "export default DoctorContextProvider" in the last part of the code, after that go to your main.jsx file and put curly bracket on ContextProvider.
export const DoctorContextProvider = ({children}) => {
 
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')
  const [appointments,setAppointments] = useState([])
  const [dashData,setDashData] = useState(false)
  const [profileData,setProfileData] = useState(false)

  const getAppointments = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
       if (data.success) {
        setAppointments(data.appointments)
        // console.log(data.appointments)
        
       } else {
        toast.error(data.message)
       }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
      
      
    }

  }

  const completeAppointment = async (appointmentId) => {

    try {
      
      const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers:{dToken}})
        if (data.success) {
          toast.success(data.message)
          getAppointments()

        } else {
          toast.error(data.message)
        }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {
      
      const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{dToken}})
        if (data.success) {
          toast.success(data.message)
          getAppointments()

        } else {
          toast.error(data.message)
        }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  const getDashData = async () => {

    try {

      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard', {headers:{dToken}})
       if (data.success) {
        setDashData(data.dashData)
        // console.log(data.dashData)  
        
       } else {
        toast.error(data.message)
       }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getProfileData = async () => {

    try {
      
      const {data} = await axios.get(backendUrl + '/api/doctor/profile', {headers:{dToken}})
        if (data.success) {
          setProfileData(data.profileData)
          console.log(data.profileData)
              
        } else {
          toast.error(data.message)
        }
      

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  // Change this format ⬇️
  // const value = {
  //   dToken, setDToken,
  //   backendUrl,
  //   appointments,setAppointments,getAppointments,
  //   completeAppointment,cancelAppointment,
  //   dashData,setDashData,getDashData,

  // }

  // return (
  //   <DoctorContext.Provider value={value}>
  //     {children}
  //   </DoctorContext.Provider>
  // )
 
  // To this one ⬇️
  return (
    <DoctorContext.Provider
      value={{
        dToken,
        setDToken,
        backendUrl,
        appointments,setAppointments,getAppointments,
        completeAppointment,cancelAppointment,
        dashData,setDashData,getDashData,
        profileData,setProfileData,getProfileData,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

