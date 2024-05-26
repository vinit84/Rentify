import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import { getDatabase, ref, get } from "firebase/database";
import Card from "./Seller/Card";
import CustomDropdown from "./CustomDropdown";

function Houses() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roomFilter, setRoomFilter] = useState("");
  const [propertiesPerPage] = useState(12);
  const [priceFilter, setPriceFilter] = useState("");
  const [furnishedFilter, setFurnishedFilter] = useState("");
  const [petFriendlyFilter, setPetFriendlyFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const db = getDatabase();
        const propertiesRef = ref(db, "users");
        const snapshot = await get(propertiesRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const allProperties = [];
          for (const userId in usersData) {
            if (usersData[userId].properties) {
              for (const propertyId in usersData[userId].properties) {
                allProperties.push({
                  userId,
                  propertyId,
                  ...usersData[userId].properties[propertyId],
                });
              }
            }
          }
          setProperties(allProperties);
          setFilteredProperties(allProperties);
        } else {
          console.log("No properties found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProperties();
  }, []);

  const filtered = useMemo(() => {
    let filtered = properties;

    if (filter) {
      filtered = filtered.filter(
        (property) => property.propertyType === filter
      );
    }
    if (roomFilter) {
      filtered = filtered.filter(
        (property) => property.bedrooms === roomFilter
      );
    }
    if (priceFilter) {
      const [min, max] = priceFilter.split("-").map(Number);
      filtered = filtered.filter((property) => {
        const price = Number(property.rentPrice);
        return price >= min && (max ? price <= max : true);
      });
    }

    if (furnishedFilter) {
      filtered = filtered.filter(
        (property) => property.furnished === furnishedFilter
      );
    }
    if (petFriendlyFilter) {
      filtered = filtered.filter(
        (property) => property.petFriendly === petFriendlyFilter
      );
    }

    return filtered;
  }, [
    filter,
    roomFilter,
    priceFilter,
    properties,
    petFriendlyFilter,
    furnishedFilter,
  ]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [filtered]);

  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filtered.slice(
    indexOfFirstProperty,
    indexOfLastProperty
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filtered.length / propertiesPerPage);

  useEffect(() => {
    setFilteredProperties(filtered);
  }, [filtered]);

  const propertyTypes = [
    "Property",
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
    "Studio",
    "Loft",
    "Duplex",
    "Villa",
    "Penthouse",
    "Commercial Property",
  ];

  const roomOptions = ["Rooms", "1", "2", "3", "4", "5+"];
  const priceOptions = ["Price", "0-1000", "1000-2000", "2000-3000", "3000+"];
  const furnishedOptions = ["Furnished", "Yes", "No"];
  const petFriendlyOptions = ["Pet Friendly", "Yes", "No"];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="">
      <div className="relative">
        <Navbar />
      </div>

      <div className="flex flex-col px-20 h-72 gap-y-5 bg-neutral-50 max-w-[130rem] mx-auto ">
        <div className="text-neutral-500 pt-40 text-base Gilroy-Regular ">
          {currentProperties.length} appear from {filtered.length} Results
        </div>
        <div className="flex flex-row gap-x-5">
          <CustomDropdown
            options={propertyTypes}
            value={filter}
            placeholder="Property"
            onChange={(value) => setFilter(value === "Property" ? "" : value)}
            className="w-28"
          />
          <CustomDropdown
            options={roomOptions}
            value={roomFilter}
            placeholder="Rooms"
            onChange={(value) => setRoomFilter(value === "Rooms" ? "" : value)}
            className="w-28"
          />
          <CustomDropdown
            options={priceOptions}
            value={priceFilter}
            placeholder="Price"
            onChange={(value) => setPriceFilter(value === "Price" ? "" : value)}
            className="w-28"
          />
          <CustomDropdown
            options={furnishedOptions}
            value={furnishedFilter}
            placeholder="Furnished"
            onChange={(value) =>
              setFurnishedFilter(value === "Furnished" ? "" : value)
            }
            className="w-28"
          />
          <CustomDropdown
            options={petFriendlyOptions}
            value={petFriendlyFilter}
            placeholder="Pet Friendly"
            onChange={(value) =>
              setPetFriendlyFilter(value === "Pet Friendly" ? "" : value)
            }
            className="w-36" // Adjust the width as needed
          />
        </div>
      </div>

      <div className="relative w-full flex flex-col h-100 max-w-[130rem] mx-auto mt-5">
        {currentProperties.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            No properties available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 px-20">
            {currentProperties.map((property, index) => (
              <div
                key={property.propertyId}
                className={`flex flex-col ${index >= 4 ? "mt-[10rem]" : ""}`}
              >
                <Card
                  userId={property.userId}
                  propertyId={property.propertyId}
                  propertyDetails={property}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-[13rem] py-10 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 mx-1 rounded-full transition-colors duration-300 ${
              currentPage === i + 1
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Houses;
