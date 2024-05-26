import React from "react";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import house from "../assets/house.png";

function Home() {
  return (
    <div className="relative w-full flex flex-col justify-center items-center h-100 max-w-[130rem]  mx-auto">
      <Navbar />

      <div className="flex flex-row justify-between items-center bg-gradient-to-r from-sky-100 to-blue-100 rounded-bl-3xl rounded-br-3xl w-full h-full px-10">
        <div className="flex flex-col max-w-[40rem] ml-10 h-full justify-center items-center text-center gap-y-10">
          <div className="text-center flex flex-col justify-center items-center gap-y-3">
            <div className="text-[#1D5E6D]  flex flex-start text-6xl">
              Find out a place
            </div>
            <div className="text-[#1D5E6D] flex flex-start text-6xl Gilroy-Bold ">
              you'll love to live
            </div>
          </div>
          <div className="w-96 text-center text-neutral-500 text-lg Gilroy-Medium leading-7">
            With the most complete source of homes for sale & real estate near
            you
          </div>
          <div className=" h-16 flex items-center justify-end">
            <input
              type="text"
              placeholder="Enter address, zip, city"
              className="flex rounded-lg p-5 w-[30rem] text-neutral-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border-2 Gilroy-Medium"
            ></input>
            <button className="w-32 h-12 absolute bg-emerald-500 hover:bg-emerald-600 transition duration-300 ease-in-out rounded-3xl mr-3 text-white text-lg Gilroy-SemiBold">
              Search
            </button>
          </div>
        </div>

        <div className="flex items-end">
          <img src={house} className="w-200"></img>
        </div>
      </div>
    </div>
  );
}

export default Home;
