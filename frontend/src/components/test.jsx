import { useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"

const test = () => {
  const {specialty} = useParams()
  const {doctors} = useContext()
  const navigate = useNavigate()
  return (
    <div>
      <p
  onClick={() =>
    specialty === "General physician"
      ? navigate("/doctors")
      : navigate("/doctors/General physician")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "General physician" ? "bg-indigo-100 text-black" : ""
  }`}
>
  General Physician
</p>

<p
  onClick={() =>
    specialty === "Gynecologist"
      ? navigate("/doctors")
      : navigate("/doctors/Gynecologist")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "Gynecologist" ? "bg-indigo-100 text-black" : ""
  }`}
>
  Gynecologist
</p>

<p
  onClick={() =>
    specialty === "Dermatologist"
      ? navigate("/doctors")
      : navigate("/doctors/Dermatologist")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "Dermatologist" ? "bg-indigo-100 text-black" : ""
  }`}
>
  Dermatologist
</p>

<p
  onClick={() =>
    specialty === "Pediatricians"
      ? navigate("/doctors")
      : navigate("/doctors/Pediatricians")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "Pediatricians" ? "bg-indigo-100 text-black" : ""
  }`}
>
  Pediatricians
</p>

<p
  onClick={() =>
    specialty === "Neurologist"
      ? navigate("/doctors")
      : navigate("/doctors/Neurologist")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "Neurologist" ? "bg-indigo-100 text-black" : ""
  }`}
>
  Neurologist
</p>

<p
  onClick={() =>
    specialty === "Gastroenterologist"
      ? navigate("/doctors")
      : navigate("/doctors/Gastroenterologist")
  }
  className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
    specialty === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""
  }`}
>
  Gastroenterologist
</p>

    </div>
  )
}

export default test
