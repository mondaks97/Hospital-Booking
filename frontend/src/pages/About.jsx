import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img className="w-full md:max-w-[350px]" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores dolorem sed ex quia, nihil possimus voluptatibus modi repudiandae rem illo!</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse et officia quibusdam quae non reiciendis? Autem nemo odit distinctio amet.</p>
          <b className="text-gray-800">Our Vision</b>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quisquam minus in eveniet veritatis qui inventore impedit, vitae facilis ipsa mollitia.</p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US?</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Efficiency:</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi atque minus repellendus quod nihil consectetur quo nulla sequi ratione soluta.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Convenience:</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem laboriosam consequuntur corporis accusamus temporibus rerum omnis cupiditate est excepturi dolorem.</p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>Personalization:</b>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda molestias beatae excepturi eos atque corporis eligendi sed, consequatur deserunt officia.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
