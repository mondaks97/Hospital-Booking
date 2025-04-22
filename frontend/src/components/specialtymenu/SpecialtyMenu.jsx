import { Link } from "react-router-dom"
import { specialtyData } from "../../assets/assets"
const SpecialtyMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-800" id="specialty">
      <h1 className="text-3xl font-medium">Find specialty</h1>
      <p className="sm:w-1/3 text-center text-sm">Lorem ipsum dolor sit amet, consectetur adipisicing elit. <br/> Iste, iure quasi voluptas ullam delectus tempore.</p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialtyData.map((item,index)=>(
          <Link onClick={()=>scrollTo(0,0)} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-200" key={index} to={`/doctors/${item.specialty}`}>
            <img className="w-16 sm:w-24 mb-2" src={item.image} alt="" />
            <p>{item.specialty}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialtyMenu

