import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, remove } from "firebase/database";
import Card from '../Seller/Card';
import UpdateForm from '../UpdateForm';

function Listed() {
  const [userId, setUserId] = useState(null);
  const [properties, setProperties] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      fetchProperties(user.uid);
    }
  }, []);

  const fetchProperties = async (userId) => {
    const db = getDatabase();
    const propertiesRef = ref(db, `users/${userId}/properties`);
    const snapshot = await get(propertiesRef);
    if (snapshot.exists()) {
      setProperties(snapshot.val());
    } else {
      setProperties({});
      console.log("No properties found for this user.");
    }
  };

  const handleUpdate = (propertyId) => {
    setSelectedProperty({ id: propertyId, details: properties[propertyId] });
  };

  const handleDelete = (propertyId) => {
    const db = getDatabase();
    const propertyRef = ref(db, `users/${userId}/properties/${propertyId}`);
    remove(propertyRef)
      .then(() => {
        console.log("Property deleted successfully.");
        fetchProperties(userId); // Refresh the properties list
      })
      .catch((error) => {
        console.error("Error deleting property: ", error);
      });
  };

  const handleCloseUpdateForm = () => {
    setSelectedProperty(null);
    fetchProperties(userId); // Refresh the properties list
  };

  if (!userId || properties === null) {
    return <div>Loading...</div>; // Or handle user not logged in or no properties found
  }

  if (Object.keys(properties).length === 0) {
    return <div className="flex justify-center items-center Gilroy-Medium h-full text-neutral-700">Your Property Will be Listed Here</div>;
  }

  return (
    <div>
      {selectedProperty ? (
        <UpdateForm
          propertyId={selectedProperty.id}
          propertyDetails={selectedProperty.details}
          onClose={handleCloseUpdateForm}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.keys(properties).map((propertyId, index) => (
            <div key={propertyId} className={`flex flex-col ${index >= 4 ? 'mt-[10rem]' : ''}`}>
              <Card userId={userId} propertyId={propertyId} propertyDetails={properties[propertyId]} />
              <div className="flex flex-row justify-between gap-x-5 mt-[10rem]">
                <button onClick={() => handleUpdate(propertyId)} className="btn btn-update relative cursor-pointer rounded-md p-2 bg-emerald-500 hover:bg-emerald-600 Gilroy-SemiBold text-white focus:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-gray-300">Update</button>
                <button onClick={() => handleDelete(propertyId)} className="btn btn-delete bg-red-600 hover:bg-red-700 Gilroy-SemiBold text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-80">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Listed;