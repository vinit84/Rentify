import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import firebase from "../firebase/firebaseconfig";
import Rentify from "../assets/Rentify.png";
import search from "../assets/searchbutton.svg";
import arrow from "../assets/Group 2.svg";

function Navbar() {
  const [userName, setUserName] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserName(user.displayName);
      } else {
        setUserName("");
      }
    });
  }, []);

  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUserName("");
        navigate("/login");
      });
  };

  // Check if the current route is /searches or /details
  const isHousesRoute = location.pathname === "/searches";
  const isDetailRoute = location.pathname.startsWith("/details/");

  return (
    <div>
      <div
        className={`absolute flex flex-row top-0 left-0 justify-between px-20 py-5 right-0 max-w-[130rem] mx-auto ${
          isHousesRoute || isDetailRoute
            ? "bg-white border-b-[#F3F3F3] border"
            : "bg-gradient-to-r from-sky-100 to-blue-100"
        }`}
      >
        <div
          className={`flex flex-row gap-10 justify-center items-center ${
            isHousesRoute || isDetailRoute ? "hidden" : "visible"
          }`}
        >
          <a
            href="#"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Buy
          </a>
          <a
            href="/searches"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Rent
          </a>
          <a
            href="/seller"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Sell
          </a>
          <a
            href="#"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Home Loans
          </a>
        </div>
        <div className="flex justify-center items-center">
        <img
            className={`flex w-28 h-12 ${isDetailRoute ? "hidden" : "visible"}`}
            src={Rentify}
            alt="Logo"
            onClick={() => navigate('/')}
          />
          {isDetailRoute && (
            <div
              className="w-32 h-5 justify-center items-center gap-2.5 inline-flex cursor-pointer"
              onClick={() => navigate("/searches")}
            >
              <img src={arrow} className="w-3.5 h-3.5 relative" />
              <div className="text-emerald-500 text-sm Gilroy-Regular">
                Back to Maps
              </div>
            </div>
          )}

          <>
            <div
              className={`flex items-center justify-end ${
                isHousesRoute ? "visible" : "hidden"
              }`}
            >
              <input
                type="text"
                placeholder="Search location.."
                className="ml-10 Gilroy-Medium focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border p-3 w-96 h-12 bg-gray-50 rounded-[10px]"
              />
              <div className="w-11 h-9 absolute justify-end items-end mr-2 cursor-pointer">
                <svg
                  width="46"
                  height="36"
                  viewBox="0 0 46 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="46" height="36" rx="10" fill="#3B3A40" />
                  <circle
                    cx="22.4439"
                    cy="17.4439"
                    r="6.44394"
                    stroke="white"
                    stroke-width="1.5"
                  />
                  <path
                    d="M26.995 21.9951L30 25.0002"
                    stroke="white"
                    stroke-width="1.5"
                  />
                </svg>
              </div>
            </div>
            <div
              className={`flex flex-row gap-10 justify-center items-center ${
                isHousesRoute
                  ? "ml-10 visible"
                  : isDetailRoute
                  ? "ml-[20rem] visible"
                  : "hidden"
              }`}
            >
              <a
                href="#"
                className="text-neutral-500 text-sm Gilroy-Medium nav-link"
              >
                Buy
              </a>
              <a
                href="/searches"
                className="text-neutral-500 text-sm Gilroy-Medium nav-link"
              >
                Rent
              </a>
              <a
                href="/seller"
                className="text-neutral-500 text-sm Gilroy-Medium nav-link"
              >
                Sell
              </a>
              <a
                href="#"
                className="text-neutral-500 text-sm Gilroy-Medium nav-link"
              >
                Home Loans
              </a>
            </div>
          </>
        </div>
        <div className="flex justify-center items-center gap-5">
          <a
            href="#"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Advertise
          </a>
          <a
            href="#"
            className="text-neutral-500 text-sm Gilroy-Medium nav-link"
          >
            Help
          </a>
          {userName ? (
            <div className="relative">
              <div
                className="bg-[#348193] text-white p-5 h-5 w-5 rounded-full Gilroy-Medium flex justify-center items-center cursor-pointer"
                onClick={() => setShowLogout(!showLogout)}
              >
                {userName[0].toUpperCase()}
              </div>
              {showLogout && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="started bg-[#348193] hover:bg-[#2e7383] text-white h-8 sm:h-10 w-20 sm:w-24 md:w-28 rounded-full ml-2 sm:ml-3 Gilroy-Medium transition duration-300 ease-in-out"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
