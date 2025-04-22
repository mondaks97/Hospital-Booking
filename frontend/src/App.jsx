import { Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar/Navbar'
import About from './pages/About'
import Appointment from './pages/appointment/Appointment'
import Contact from './pages/Contact'
import Doctors from './pages/doctors/Doctors'
import Home from './pages/Home'
import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/Login'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/footer/Footer'


const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
       <Navbar/>
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/doctors' element={<Doctors />} />
      <Route path='/doctors/:specialty' element={<Doctors />} />
      <Route path='/login' element={<Login />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />
      <Route path='/my-profile' element={<MyProfile />} />
      <Route path='/my-appointments' element={<MyAppointments />} />
      <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
