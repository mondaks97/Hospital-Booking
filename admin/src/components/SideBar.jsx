import { useContext } from "react"
import { AdminContext } from "../context/AdminContext"
import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"
import { DoctorContext } from "../context/DoctorContext"

const SideBar = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r-width-0'>
      {
        aToken && <ul className="text-[#515151] mt-5">
 
          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/admin-dashboard'}>
            <img src={assets.home_icon} alt="" /> 
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/doctors-list'}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/all-appointment'}>
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/add-doctor'}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>
        </ul>
      }



      {
        dToken && <ul className="text-[#515151] mt-5">
 
          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/doctor-dashboard'}>
            <img src={assets.home_icon} alt="" /> 
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/doctor-appointments'}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#f2f3ff] border-r-4 border-blue-400' : ''}`} to={'/doctor-profile'}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>

          
        </ul>
      }
    </div>
  )
}

export default SideBar
