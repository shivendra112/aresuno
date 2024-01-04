import React, { useEffect, useState } from "react";
import { FiCrosshair, FiHardDrive, FiNavigation } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
// import { getBanner } from "../../../bannerSlice";
// getBanner
import axios from "axios";
import { getBanner } from "../../../state/slices/bannerSlice";
import Header from "../../../Components/Header/Header";
import { Link } from "react-router-dom";
import {setUserCoordinates, setUserLocationName} from "../../../state/slices/userSlice";

const Banner = () => {
  const bannerUrl = useSelector((state) => state.banner.url);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchBoxFocused, setIsSearchBoxFocused] = useState(false);
  // const [crds, setCrds] = useState([]);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [slugLocationName, setSlugLocationName] = useState("");


  
  useEffect(() => {
    // Initialize Google Places Autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('location-input')
    );

    // Listen for the 'place_changed' event
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log(place)
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        // setCoordinates([lat, lng]);
        dispatch(setUserCoordinates({lat, lng}))
        dispatch(setUserLocationName({locationName: place.name}))
        
        setSlugLocationName(place.name)
        // Use lat and lng to fetch nearby businesses or update the state
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
      }
    });
  }, []);


  

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await axios.get(
          "https://aresuno-server.vercel.app/api/banner"
        );
        dispatch(getBanner(res.data[0].image));
      } catch (err) {
        console.log(err);
      }
    };

    fetchBanner();
  }, [dispatch]);

  const filteredSubcategories = categories.flatMap((category) => category.subcategories).filter((subcategory) => 
    subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetectLocation = async () => {
    const success = async (pos) => {
      const crds = pos.coords;
      console.log(`Latitude: ${crds.latitude}`);
      console.log(`Longitude: ${crds.longitude}`);
      // const location = await axios.post("http://localhost:8000/api/getLocationFromLatLong", {lat : crds.latitude, long : crds.longitude})
      // const location = await axios.get(`http://localhost:8000/api/getLocationFromLatLong?lat=${crds.latitude}&long=${crds.longitude}`)
      const location = await axios.get(`https://aresuno-server.vercel.app/api/getLocationFromLatLong?lat=${crds.latitude}&long=${crds.longitude}`)
      console.log(location.data);
      setLocation(location.data);
    }
  
    const error = (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      alert("Geolocation is not supported by this browser.")
    }


  }

  return (
    <div className="relative flex-col self-stretch flex w-full items-center max-md:max-w-full  h-[45vh] bg-gradient-to-b from-blue-800 to-blue-900">
      {/* style={{backgroundImage: "linear-gradient(to right, #0f2027, #203a43, #2c5364)"}} */}
      <div className=" z-[999] w-full">
      <Header homePage={true}/>
      </div>
      <div className="gradient-overlay-top-banner h-[100%] z[-1]"></div>
      <img
        loading="lazy"
        src={bannerUrl}
        className="absolute h-full w-full object-cover object-center inset-0"
      />
      <div className="absolute -bottom-32 md:-bottom-8 z-[10] m-auto px-5 md:px-0  max-w-[1100px] flex w-full flex-col max-md:max-w-full max-md:my-10 gap-4 md:gap-10 items-start justify-start">
        <div className="text-white   max-md:max-w-full flex flex-col gap-1 md:gap-2">
          {/* <p className="text-5xl font-bold">Welcome to Aresuno</p> */}
          <p className="text-2xl md:text-4xl font-bold">Find your next service</p>
          <p className="text-base md:text-xl">at most affordable prices, from over 1000+ services</p>
        </div>
        <div className="bg-white shadow-lg relative flex flex-col md:flex-row w-full items-center justify-between gap-[6px] px-[6px] py-[6px] rounded-lg md:rounded-2xl">

          <div className=" md:relative md:border-r-2 border-black rounded-tr-none rounded-br-none w-full h-full flex px-2 py-1 md:px-5 md:py-2 rounded-xl items-center gap-3 bg-white" >
            <FiHardDrive className="w-6 h-6"/>
            <input
              className=" py-1 focus:outline-none text-sm text-black md:text-base w-full h-full"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchBoxFocused(true)}
              // onBlur={() => setIsSearchBoxFocused(false)}
            />
{ searchQuery && isSearchBoxFocused &&
            <div className="absolute z-10 px-2 md:px-4 max-h-72 overflow-y-auto py-3 md:py-5 bg-white shadow-xl w-full top-10  md:top-14 rounded-b-xl left-0 text-sm md:text-base">
              <div className="flex flex-col gap-1 md:gap-2">
              {filteredSubcategories?.map((category, index) => (
                <Link to={`/${category.name.split(" ").join("-").toLowerCase()}`} key={index}>
                <p key={category.name}>{category.name}</p>
                </Link>
              ))}

              {filteredSubcategories.length === 0 && <p>No results found</p>}

            </div>
            </div>

              }
          </div>

          <div className=" w-full h-full flex px-2 py-1 md:px-5 md:py-2 rounded-xl items-center gap-3 bg-white">
            <FiNavigation className="w-6 h-6"/>
            <input
              className=" py-1 focus:outline-none text-sm text-black md:text-base w-full h-full"
              placeholder="Your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              id="location-input"
            />
            <FiCrosshair className="w-6 h-6 text-gray-500" onClick={handleDetectLocation}/>
          </div>

          <div className="w-full flex items-center h-full bg-blue-600 rounded-xl px-3 py-2 md:px-5 md:py-2">
            <button className="text-base text-white text-center w-full">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
