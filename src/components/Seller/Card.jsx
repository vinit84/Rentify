import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";
import Carousel from "./Carousel";
import bed from "../../assets/hotel-bed-fill.svg";
import sink from "../../assets/sink.svg";
import ruler from "../../assets/ruler-fill.svg";
import { useNavigate } from "react-router-dom";

function Card({ userId, propertyId }) {
  const [images, setImages] = useState([]);
  const [rentPrice, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    if (!userId || !propertyId) {
      console.error("userId or propertyId is missing");
      return;
    }

    const db = getDatabase();
    const propertyRef = ref(db, `users/${userId}/properties/${propertyId}`);
    get(propertyRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const propertyData = snapshot.val();
          setImages(propertyData.images || []);
          setPrice(propertyData.rentPrice || '');
          setBedrooms(propertyData.bedrooms || '');
          setBathrooms(propertyData.bathrooms || '');
          setArea(propertyData.area || '');
          setAddress(propertyData.address || '');
          setZip(propertyData.zip || '');
          setCity(propertyData.city || '');
          setState(propertyData.state || '');
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId, propertyId]);

    const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(price);
  };

const navigate = useNavigate();

  return (
    <div className="h-[5rem] w-[18rem] sm:h-20 xl:h-40 2xl:h-48" onClick={() => navigate(`/details/${userId}/${propertyId}`, { state: { userId, propertyId } })}>
      <Carousel images={images} />
      <div className="flex flex-col gap-y-3">
        <div className="text-neutral-700 text-2xl Gilroy-SemiBold">
          ₹ {formatPrice(rentPrice)}
        </div>
        <div className="flex flex-row justify-between max-w-[10rem]">
          <div className="w-5 h-5 relative flex flex-row gap-x-2">
            <img className="w-6 h-6" src={bed} />
            <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
              {bedrooms}bd
            </div>
          </div>
          <div className="w-4 h-4 relative flex flex-row gap-x-2">
            <img className="w-6 h-6" src={sink} />
            <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
              {bathrooms}ba
            </div>
          </div>
          <div className="w-4 h-4 relative flex flex-row gap-x-2">
            <img className="w-6 h-6" src={ruler} />
            <div className="text-neutral-500 text-base Gilroy-Regular font-['Inter']">
              {area}sqft
            </div>
          </div>
        </div>
        <div className="text-neutral-500 text-base Gilroy-Regular leading-relaxed">
          <div>{zip} {address}</div>
          <div>{city} , {state}</div>
        </div>
      </div>
    </div>
  );
}

export default Card;