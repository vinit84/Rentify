import React, { useEffect, useState } from "react";
import bed from "../assets/hotel-bed-fill.svg";
import sink from "../assets/sink.svg";
import ruler from "../assets/ruler-fill.svg";
import item from "../assets/Item.svg";
import ToggleButton from "./ToggleButton";
import CustomDropdown from "./CustomDropdown";
import { useNavigate } from "react-router-dom";
import { getAuth } from "@firebase/auth";

function PropertyDetails({ property }) {
  const timeOptions = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [meetingType, setMeetingType] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;


  useEffect(() => {
    console.log(`Time: ${selectedTime}, Name: ${name}, Phone: ${phone}, Email: ${email}, MeetingType: ${meetingType}`);

 
    const isValid = selectedTime && name.trim() && phone.trim() && email.trim() && meetingType;
    setIsFormValid(isValid);
  }, [selectedTime, name, phone, email, meetingType]);

  const handleTimeChange = (option) => {
    setSelectedTime(option);
  };

  const handleInterestClick = () => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    if (isFormValid) {
      setIsBlurred(false);
    }
  };



  return (
    <div className="flex flex-col lg:flex-row justify-between items-start p-6 px-20 bg-white shadow-lg rounded-lg">
      <div className="w-full lg:w-2/3 gap-y-5 flex flex-col max-w-[40rem] ">
        <p className="text-[#64626A] Gilroy-Regular">
          {property.state} , {property.city} , {property.zip}
        </p>

        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-3xl Gilroy-Bold max-w-[40rem] text-[#3B3A40]">
              {property.title}
            </h2>
            <div className="flex flex-row justify-between max-w-[12rem]">
              <div className="w-5 h-5 relative flex flex-row gap-x-2">
                <img className="w-6 h-6" src={bed} />
                <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
                  {property.bedrooms}bd
                </div>
              </div>
              <div className="w-4 h-4 relative flex flex-row gap-x-2">
                <img className="w-6 h-6" src={sink} />
                <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
                  {property.bathrooms}ba
                </div>
              </div>
              <div className="w-4 h-4 relative flex flex-row gap-x-2">
                <img className="w-6 h-6" src={ruler} />
                <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
                  {property.area}sqft
                </div>
              </div>
            </div>
          </div>
          <div>
            <img src={item} className=""></img>
          </div>
        </div>
        <p className="text-gray-700 Gilroy-Regular pb-5">
          {property.description}
        </p>

        <div className="py-10 flex flex-col gap-y-5 text-neutral-700 border-[#F1F1F1] border-t-2">
          <span className="text-xl Gilroy-SemiBold">
            Home Details for {property.title}{" "}
          </span>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-500 mr-2">✔</span>
                <span className="text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="py-10 flex flex-col gap-y-5 text-neutral-700 border-[#F1F1F1] border-t-2">
          <span className="text-xl Gilroy-SemiBold">
            <span>Agents by</span>
          </span>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div
              className={`flex flex-row justify-between items-center max-w-[12rem] ${
                isBlurred ? "blur-sm" : "blur-none"
              } transition-all duration-300 ease-in-out`}
            >
              <div className="w-14 h-14 Gilroy-SemiBold rounded-full bg-emerald-600  flex justify-center items-center text-white text-xl">
                {property.sellerName.charAt(0)}
              </div>
              <div className="flex flex-col ">
                <div className=" Gilroy-SemiBold">{property.sellerName}</div>
                <div className=" Gilroy-SemiBold text-neutral-500">
                  {property.contactPhone}
                </div>
              </div>
            </div>
            <div
              className={`flex justify-end items-center ${
                isBlurred ? "blur-sm" : "blur-none"
              } transition-all duration-300 ease-in-out`}
            >
              <div className="w-fit rounded-full bg-emerald-500 p-1 px-2 text-white flex flex-row text-sm Gilroy-SemiBold justify-end items-center">
                <div>{property.contactEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[30rem] h-fit flex flex-col relative">
        <div className="w-[30rem] h-fit flex flex-col gap-y-5  left-0 top-0 bg-white rounded-3xl shadow p-7">
          <div className="flex flex-row justify-between w-full h-fit border-b-2 border-[#F1F1F1] pb-5">
            <div className="flex flex-col">
              <span className="text-neutral-700 Gilroy-SemiBold text-3xl">
                ₹ {property.rentPrice}/yr
              </span>
              <div className="text-neutral-500 text-md  Gilroy-Regular leading-relaxed">
                Est. Mortgage ₹ 6,250/mo
              </div>
            </div>
            <div className="w-32 h-14 bg-opacity-10 flex  bg-emerald-500 rounded-2xl justify-center items-center text-center">
              <div className="text-center text-emerald-600 text-base justify-center items-center Gilroy-SemiBold">
                Estimation
              </div>
            </div>
          </div>
          <ToggleButton onChange={(value) => setMeetingType(value)} />
          <CustomDropdown
            options={timeOptions}
            value={selectedTime} 
            onChange={handleTimeChange}
            placeholder="Choose a time"
            className="mt-4"
          />
          <div className="flex flex-row justify-between">
            <div className="relative w-52">
              <input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 bg-white flex flex-row Gilroy-Regular justify-start items-center pl-[3rem] rounded-2xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border-2 border-zinc-100"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="User">
                    <path
                      id="Path"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.7174 4.67826C13.7956 2.60435 12.0348 1 9.99999 1C7.96521 1 6.16521 2.64348 6.2826 4.67826C6.32173 5.1087 6.71304 7.14348 6.71304 7.14348C7.02608 8.90435 8.19999 10.3913 9.99999 10.3913C11.8 10.3913 12.9739 8.90435 13.2869 7.10435C13.2869 7.10435 13.6783 5.06957 13.7174 4.67826Z"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                    <path
                      id="Path_2"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19 19.0001H1L1.43043 15.7914C1.62609 14.7349 2.56522 14.1088 3.62174 13.874L10 12.7393L16.3783 13.874C17.4348 14.1088 18.3739 14.7349 18.5304 15.7914L19 19.0001Z"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="relative w-52">
              <input
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-52 h-14 bg-white flex flex-row Gilroy-Regular justify-start items-center pl-[3rem] rounded-2xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border-2 border-zinc-100"
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                <svg
                  width="12"
                  height="20"
                  viewBox="0 0 12 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Smart Phone">
                    <path
                      id="Path"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.56522 1H9.6087C10.4696 1 11.1739 1.70435 11.1739 2.56522V17.4348C11.1739 18.2957 10.4696 19 9.6087 19H2.56522C1.70435 19 1 18.2957 1 17.4348V2.56522C1 1.70435 1.70435 1 2.56522 1Z"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                    <path
                      id="Path_2"
                      d="M1 15.8695H11.1739"
                      stroke="black"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className="relative w-full">
            <input
              placeholder="Your mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-white flex flex-row Gilroy-Regular justify-start items-center pl-[4rem] rounded-2xl focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 border-2 border-zinc-100"
            />
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Mail">
                  <path
                    id="Path"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 1H22.6471V1V13.2353C22.6471 15.3059 20.9529 17 18.8824 17H4.76471C2.69412 17 1 15.3059 1 13.2353V1V1Z"
                    stroke="#3B3A40"
                    stroke-width="1.5"
                  />
                  <path
                    id="Path_2"
                    d="M3.49414 3.77637L11.8236 11.3528L20.2 3.77637"
                    stroke="#3B3A40"
                    stroke-width="1.5"
                  />
                </g>
              </svg>
            </div>
          </div>
          <div className="w-full h-14 relative">
            <button
              className="w-full h-14 flex justify-center items-center text-lg text-white Gilroy-SemiBold left-0 top-0 bg-emerald-500 rounded-2xl"
              onClick={handleInterestClick}
              disabled={!isFormValid}
            >
              I,m Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
