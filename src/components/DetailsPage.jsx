import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import DetailCarousel from "./DetailCarousel";
import Navbar from "./Navbar";
import PropertyDetails from "./PropertyDetails";

function DetailsPage() {
  const { userId, propertyId } = useParams();
  const [propertyDetails, setPropertyDetails] = useState({
    address: "",
    state: "",
    city: "",
    zip: "",
    title: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: "",
    rentPrice: "",
    mortgage: "",
    description: "",
    amenities: [],
    sellerName: "",
    contactEmail: "",
    contactPhone: "",
    tourDates: [],
    tourTimes: [],
    images: [],
  });

  useEffect(() => {
    if (userId && propertyId) {
      const db = getDatabase();
      const propertyRef = ref(db, `users/${userId}/properties/${propertyId}`);
      get(propertyRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setPropertyDetails({
              address: data.address || "",
              state: data.state || "",
              city: data.city || "",
              zip: data.zip || "",
              title: data.title || "",
              bedrooms: data.bedrooms || "",
              bathrooms: data.bathrooms || "",
              area: data.area || "",
              rentPrice: data.rentPrice || "",
              description: data.description || "",
              amenities: data.amenities ? data.amenities.split(",") : [],
              sellerName: data.sellerName || "",
              contactEmail: data.contactEmail || "",
              contactPhone: data.contactPhone || "",
              tourDates: data.tourDates || [],
              tourTimes: data.tourTimes || [],
              images: data.images || [],
            });
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId, propertyId]);

  return (
    <div className="flex flex-col justify-center items-center max-w-[130rem] mt-20 mx-auto">
      <Navbar />
      <div className="w-full">
        <DetailCarousel images={propertyDetails.images || []} />
      </div>
      <div className="w-full mt-10">
        <PropertyDetails property={propertyDetails} />
      </div>
    </div>
  );
}

export default DetailsPage;
