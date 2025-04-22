import { assets } from "../../assets/assets"

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      {/*-----Left Section-----*/}
      <div>
        <img className="mb-5 w-40" src={assets.logo} alt="" />
        <p className="w-full md:w-2/3 text-gray-600 leading-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione quam excepturi corporis quisquam recusandae eveniet. Ipsum tempora voluptatibus ipsam obcaecati laudantium consectetur aspernatur officia doloremque et odio, quam ipsa illum nulla pariatur fugiat dolor nihil! Beatae optio consequuntur quam magnam ad inventore. Deleniti quae praesentium officia quasi cum perferendis illo.</p>
      </div>

      {/*-----Center Section-----*/}
      <div>
        <p className="text-xl mb-5 font-medium">Company</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>Home</li>
          <li>About Us</li>
          <li>Contact Us</li>
          <li>Privacy Policy</li>
        </ul>
      </div>

      {/*-----Right Section-----*/}
      <div>
        <p className="text-xl mb-5 font-medium">GET IN TOUCH</p>
        <ul className="flex flex-col gap-2 text-gray-600">
          <li>341412412512</li>
          <li>Test@gmail.com</li>
        </ul>
      </div>
      </div>
      {/*--------Copyright Text------*/}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright 2024@ Test = All Right Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
