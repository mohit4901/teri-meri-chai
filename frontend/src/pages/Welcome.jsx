import React from "react";
import { Link } from "react-router-dom";
import mm from "../assets/mm.png";
import { FiShoppingCart } from "react-icons/fi";
import SimpleCarousel from "../components/Carousel";

const Welcome = () => {
  return (
    
    <div className="p-8 text-center">
<SimpleCarousel/>
      
      <Link
        to="/menu"
        className="block mt-[280px] bg-black text-white px-6 py-3 rounded-lg font-serif hover:bg-gray-800"
      >
        View Menu
      </Link>



<div className="mt-[60px] flex">
  <img className="h-[200px] rounded-xl" src={mm} alt="mm" />
  <div>
  <h1 className="p-5 font-bold text-xl font-serif">Best Chinese Food In Town</h1>
  <div className="flex ml-[90px]"> 
  <h3 className=" font-medium text-l font-serif">Order Now   </h3>
  
  <FiShoppingCart size={15} className="mt-1.5 ml-1.5"/> 
  </div>
  </div>
</div>

    </div>
  );
};

export default Welcome;
