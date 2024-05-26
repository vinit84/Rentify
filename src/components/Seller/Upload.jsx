import React, { useEffect, useRef, useState } from "react";
import { PhotoIcon, FilmIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { get, getDatabase, push, ref, set } from "firebase/database";
import { getAuth } from "@firebase/auth";
import { app } from "../../firebase/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import animationData from "./uploadanimation.json";
import Lottie from "react-lottie";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const notifySuccess = () =>
  toast.success("Video uploaded successfully!", {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const notifyError = (errorMessage) =>
  toast.error(errorMessage, {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

const UploadForm = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [video, setVideo] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [parking, setParking] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [totalFloors, setTotalFloors] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [furnished, setFurnished] = useState("");
  const [petFriendly, setPetFriendly] = useState("");
  const [nearbySchools, setNearbySchools] = useState("");
  const [nearbyTransport, setNearbyTransport] = useState("");
  const [nearbyHospitals, setNearbyHospitals] = useState("");
  const [amenities, setAmenities] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [leaseDuration, setLeaseDuration] = useState("");
  const [propertyImages, setPropertyImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);

  const storage = getStorage();
  const db = getDatabase();

  const handleImagesUpload = async (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // Local URL for preview
    }));

    // Update propertyImages with new images, ensuring not to exceed 6 images in total
    setPropertyImages((current) => [...current, ...newImages].slice(0, 6));

    // Now upload to Firebase and update URLs for permanent storage
    const uploadPromises = files.map((file) => {
      const filePath = `properties/images/${file.name}`;
      const fileRef = storageRef(getStorage(), filePath);
      return uploadBytes(fileRef, file).then((snapshot) =>
        getDownloadURL(snapshot.ref)
      );
    });

    const urls = await Promise.all(uploadPromises);

    // Update the propertyImages with the URLs from Firebase
    setPropertyImages((currentImages) =>
      currentImages.map((img, index) => ({
        ...img,
        url: urls[index] || img.url, // Update with Firebase URL, fallback to local URL if any issue
      }))
    );
  };

  const uploadVideo = async (file) => {
    const videoPath = `properties/videos/${file.name}`;
    const videoRef = storageRef(storage, videoPath);
    const uploadTask = uploadBytesResumable(videoRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress); // Update the progress state
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
        toast.error("Upload failed. Please try again.");
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Update state or perform further actions with the download URL
          setVideo({ file, url: downloadURL });
          setUploadProgress(0); // Reset progress after upload is complete
        });
      }
    );
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for preview
      const localUrl = URL.createObjectURL(file);
      // Update the video state with the file and local URL
      setVideo({ file, localUrl });
    }
  };

  const handleVideoChangeClick = () => {
    // Trigger click on hidden video file input
    videoInputRef.current.click();
  };

  const removeImage = (index) => {
    setPropertyImages((currentImages) =>
      currentImages.filter((_, i) => i !== index)
    );
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to upload properties.");
      setIsUploading(false);
      return;
    }

    const userId = user.uid; // Get the user's UID from Firebase Authentication

    try {
      // Upload video to Firebase Storage and
      // Upload video to Firebase Storage and get the URL
      let videoUrl = null;
      if (video && video.file) {
        const videoPath = `properties/videos/${video.file.name}`;
        const videoRef = storageRef(storage, videoPath);
        await uploadBytes(videoRef, video.file);
        videoUrl = await getDownloadURL(videoRef);
      }

      // Upload images to Firebase Storage and get the URLs
      const imageUrls = await Promise.all(
        propertyImages.map(async (image) => {
          const imagePath = `properties/images/${image.file.name}`;
          const imageRef = storageRef(storage, imagePath);
          await uploadBytes(imageRef, image.file);
          return await getDownloadURL(imageRef);
        })
      );

      const propertyData = {
        title,
        description,
        address,
        city,
        state,
        zip,
        neighborhood,
        area,
        bedrooms,
        bathrooms,
        parking,
        floorNumber,
        totalFloors,
        rentPrice,
        depositAmount,
        availabilityDate,
        furnished,
        petFriendly,
        nearbySchools,
        nearbyTransport,
        nearbyHospitals,
        amenities,
        sellerName,
        contactEmail,
        contactPhone,
        propertyType,
        leaseDuration,
        videoUrl, // Add video URL to property data
        images: imageUrls, // Add image URLs to property data
      };

      // Push data under the specific user's userId
      const newPropertyRef = push(ref(db, `users/${userId}/properties`));
      await set(newPropertyRef, propertyData);
      toast.success("Property uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <ToastContainer />
      {isUploading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 z-50 flex justify-center items-center">
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
      )}
      <form onSubmit={handleSubmit} method="post" enctype="multipart/form-data">
        <div className="space-y-8">
          <div className="bg-white shadow-xl sm:rounded-2xl ring-1 ring-black ring-opacity-5 border border-[#1f2734] border-opacity-20">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="property-title"
                    className="block text-sm Gilroy-Medium leading-6 text-gray-700"
                  >
                    Property Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autoComplete="given-name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="property-description"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Property Description
                  </label>
                  <textarea
                    name="property-description"
                    id="property-description"
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="address"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="city"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="state"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="zip"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="neighborhood"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    name="neighborhood"
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="property-type"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Property Type
                  </label>
                  <select
                    id="property-type"
                    name="property-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 py-3 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  >
                    <option value="">Select Property Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Condo">Condo</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Studio">Studio</option>
                    <option value="Loft">Loft</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial Property">
                      Commercial Property
                    </option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="area"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Area (sq. ft.)
                  </label>
                  <input
                    type="number"
                    name="area"
                    id="area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Number of Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="bathrooms"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Number of Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="parking"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Number of Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parking"
                    id="parking"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="floor-number"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Floor Number
                  </label>
                  <input
                    type="number"
                    name="floor-number"
                    id="floor-number"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="total-floors"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Total Floors in Building
                  </label>
                  <input
                    type="number"
                    name="total-floors"
                    id="total-floors"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="rent-price"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Rent Price (per month)
                  </label>
                  <input
                    type="number"
                    name="rent-price"
                    id="rent-price"
                    value={rentPrice}
                    onChange={(e) => setRentPrice(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="deposit-amount"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Deposit Amount
                  </label>
                  <input
                    type="number"
                    name="deposit-amount"
                    id="deposit-amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="availability-date"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Availability Date
                  </label>
                  <input
                    type="date"
                    name="availability-date"
                    id="availability-date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="lease-duration"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Lease Duration
                  </label>
                  <select
                    id="lease-duration"
                    name="lease-duration"
                    value={leaseDuration}
                    onChange={(e) => setLeaseDuration(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 py-3 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  >
                    <option value="">Select Lease Duration</option>
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="1 Year">1 Year</option>
                    <option value="2 Years">2 Years</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="nearby-schools"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Nearby Schools/Colleges
                  </label>
                  <input
                    type="text"
                    name="nearby-schools"
                    id="nearby-schools"
                    value={nearbySchools}
                    onChange={(e) => setNearbySchools(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="nearby-hospitals"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Nearby Hospitals
                  </label>
                  <input
                    type="text"
                    name="nearby-hospitals"
                    id="nearby-hospitals"
                    value={nearbyHospitals}
                    onChange={(e) => setNearbyHospitals(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="nearby-transport"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Nearby Public Transport
                  </label>
                  <input
                    type="text"
                    name="nearby-transport"
                    id="nearby-transport"
                    value={nearbyTransport}
                    onChange={(e) => setNearbyTransport(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="furnished"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Furnished
                  </label>
                  <select
                    id="furnished"
                    name="furnished"
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 py-3 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="pet-friendly"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Pet Friendly
                  </label>
                  <select
                    id="pet-friendly"
                    name="pet-friendly"
                    value={petFriendly}
                    onChange={(e) => setPetFriendly(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 py-3 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="sm:col-span-6">
                  <label
                    htmlFor="amenities"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Amenities
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    id="amenities"
                    onChange={(e) => setAmenities(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label
                    htmlFor="property-images"
                    className="block text-sm Gilroy-Medium leading-6 text-gray-700"
                  >
                    Property Images
                  </label>
                  <p className="mt-1 text-sm leading-2 text-gray-600">
                    Select or upload pictures that highlight the best features
                    of your property. High-quality images can make your listing
                    stand out and attract more potential renters.
                  </p>
                  <div className="">
                    {propertyImages.length === 0 && (
                      <div className="mt-3 flex justify-center rounded-lg border-dashed border-2 border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-300 ease-in-out px-6 py-10 cursor-pointer">
                        <div className="text-center">
                          <PhotoIcon
                            className="mx-auto h-12 w-12 text-gray-300"
                            aria-hidden="true"
                          />
                          <div className="mt-4 flex text-sm leading-6 justify-center items-center text-gray-600">
                            <label
                              htmlFor="imageFile"
                              className="relative cursor-pointer rounded-lg p-2 bg-emerald-500 hover:bg-emerald-600 Gilroy-SemiBold text-white focus:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-gray-300"
                            >
                              <span>Upload Images</span>
                              <input
                                id="imageFile"
                                name="imageFile"
                                type="file"
                                multiple
                                accept="image/*"
                                className="sr-only"
                                ref={imageInputRef}
                                onChange={handleImagesUpload}
                              />
                            </label>
                            <p className="pl-1.5 Gilroy-Regular">
                              or drag and drop
                            </p>
                          </div>
                          <p className="text-xs Gilroy-Regular leading-5 mt-1 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {propertyImages.map((image, index) => (
                          <div key={index} className="w-full relative">
                            <img
                              src={image.url}
                              alt={`Property ${index}`}
                              className="w-full h-[9.2rem] rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                              style={{ margin: "5px" }}
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        {propertyImages.length > 0 &&
                          propertyImages.length < 6 && (
                            <div className="mt-4 flex text-sm leading-6 justify-center items-center text-gray-600">
                              <label
                                htmlFor="imageFile"
                                className="relative cursor-pointer rounded-lg p-2 bg-emerald-500 hover:bg-emerald-600 Gilroy-SemiBold text-white focus:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-gray-300"
                              >
                                <span>Upload Images</span>
                                <input
                                  id="imageFile"
                                  name="imageFile"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImagesUpload}
                                />
                              </label>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm Gilroy-Medium leading-6 text-gray-700"
                  >
                    Property Video
                  </label>
                  <p className="mt-1 text-sm leading-2 text-gray-600">
                  Select or upload a video that showcases your property in detail. A well-made video can give viewers a comprehensive look at the property, making it more appealing.
                  </p>
                  {video ? (
                    <div className="mt-4 flex flex-row justify-start items-end relative group">
                      <video
                        src={video.localUrl}
                        controls
                        className="max-w-full h-[19.5rem] rounded-lg"
                      />

                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          onClick={handleVideoChangeClick}
                          className="bg-[#00000046] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-opacity-50 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          Replace
                        </button>
                      </div>

                      {/* Hidden file input for changing the video */}
                      <input
                        ref={videoInputRef}
                        type="file"
                        name="videoFile"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </div>
                  ) : (
                    <div className="mt-3 flex justify-center rounded-lg border-dashed border-2 border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-300 ease-in-out px-6 py-10 cursor-pointer">
                      <div className="text-center">
                        <FilmIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 justify-center items-center text-gray-600">
                          <label
                            htmlFor="videoFile"
                            className="relative cursor-pointer rounded-lg p-2 bg-emerald-500 hover:bg-emerald-600 Gilroy-SemiBold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-[#5E17EB] focus-within:ring-offset-2 hover:text-gray-300"
                          >
                            <span>Upload a video</span>
                            <input
                              id="videoFile"
                              name="videoFile"
                              type="file"
                              accept="video/*"
                              className="sr-only"
                              onChange={handleVideoUpload}
                            />
                          </label>
                          <p className="pl-1.5 Gilroy-Regular">
                            or drag and drop
                          </p>
                        </div>
                        <p className="text-xs Gilroy-Regular leading-5 mt-1 text-gray-600">
                          MP4, MOV, AVI up to 10GB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  {uploadProgress > 0 && (
                    <div
                      className="mt-4 w-full bg-gray-200 rounded-full"
                      style={{ zIndex: "1000", position: "relative" }}
                    >
                      <div
                        className="bg-emerald-500 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress.toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="seller-name"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Seller Name
                  </label>
                  <input
                    type="text"
                    name="seller-name"
                    id="seller-name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-email"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contact-email"
                    id="contact-email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-phone"
                    className="block text-sm Gilroy-Medium text-gray-700"
                  >
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contact-phone"
                    id="contact-phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className=" mt-2 block w-full bg-white rounded-md border border-[#1f2734] border-opacity-20 hover:border-emerald-500 transition duration-100 ease-in-out p-2 text-black shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-gray-400 sm:text-sm sm:leading-6 Gilroy-Regular"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm Gilroy-Medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit
                </button>
                <button
                  type="reset"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm Gilroy-Medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
