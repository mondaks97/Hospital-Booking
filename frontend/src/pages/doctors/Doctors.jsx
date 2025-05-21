/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from "../../context/AppContext"
import './Doctors.css'
const Doctors = () => {
  const { specialty } = useParams();
  const { doctors } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true); // 🆕 Loading state
  const navigate = useNavigate();

  const applyFilter = () => {
    setLoading(true); // 🆕 simulan ang loading

    if (specialty) {
      const filtered = doctors.filter(doc => doc.specialty === specialty);
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }

    setLoading(false); // 🆕 tapos na mag-load
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, specialty]);

  return (
    <div>
      {/*-------Left Side-----*/}
      <p className="text-gray-600">Browse Through Doctors Specialist.</p>
      <div className="doctors">
        {/* Toggle Button for Filters */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        {/* Filter Options */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((type) => (
            <p
              key={type}
              onClick={() => specialty === type ? navigate('/doctors') : navigate(`/doctors/${type}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${specialty === type ? "bg-indigo-100 text-black" : ""}`}
            >
              {type}
            </p>
          ))}
        </div>

        {/* Right Side (Doctor Cards) */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {/* 🆕 Loading state */}
          {loading ? (
            <p className="text-gray-500">Loading doctors...</p>
          ) : filterDoc.length === 0 ? (
            // 🆕 No doctors found
            <p className="text-red-500 flex">No match result &quot;{specialty}&quot;.</p>
          ) : (
            filterDoc.map((item, index) => (
              <div
                onClick={() => navigate(`/appointment/${item._id}`)}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
                key={index}
              >
                <img className="bg-blue-50" src={item.image} alt="" />
                <div className="p-4">
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                    <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>
                  <p className="text-gray-900 font-medium">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.specialty}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Doctors
