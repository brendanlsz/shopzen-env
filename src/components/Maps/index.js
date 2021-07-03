import React, {useState} from "react";
import Geocode from "react-geocode";
import MainLayout from "../../layouts/MainLayout";

const Maps = () => {
    let [latitude, setLatitude] = useState("");
    let [longitude, setLongitude] = useState("");

    Geocode.setLanguage("en");

    Geocode.fromLatLng("48.8583701", "2.2922926").then(
        (response) => {
          const address = response.results[0].formatted_address;
          console.log(address);
          setLongitude(address);
        },
        (error) => {
          console.error(error);
        }
      );
    return (
      <div>
        <h1>Lat:{latitude}</h1>
        <h1>Lng:{longitude}</h1>
      </div>
    );
}

export default Maps;