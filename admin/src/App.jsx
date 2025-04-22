import { useContext } from 'react';
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import { Route, Routes } from 'react-router-dom';
import AllAppointments from './pages/admin/AllAppointments';
import DashBoard from './pages/admin/DashBoard';
import DoctorsList from './pages/admin/DoctorsList';
import AddDoctor from './pages/admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';


const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
     <ToastContainer/>
     <NavBar/>
     <div className='flex items-start'>
      <SideBar/>
      <Routes>
        {/* Admin Route */}
        <Route path='/' element={<></>} />
        <Route path='/admin-dashboard' element={<DashBoard/>} />
        <Route path='/all-appointment' element={<AllAppointments/>} />
        <Route path='/doctors-list' element={<DoctorsList/>} />
        <Route path='/add-doctor' element={<AddDoctor/>} />

        {/* Doctor Route */}
        <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
        <Route path='/doctor-appointments' element={<DoctorAppointments/>} />
        <Route path='/doctor-profile' element={<DoctorProfile/>} />
      </Routes>
     </div>
    </div>
  ) : (
    <>
     <Login />
     <ToastContainer/>
    </>
  )
}

export default App
