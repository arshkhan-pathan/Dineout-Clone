import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { LinearProgress } from "@mui/material";

function Maps({ coordinates }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate an asynchronous process to load the map
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  function convertStringToArray(inputString) {
    const stringValues = inputString.split(",");
    return stringValues;
  }

  const latlng = convertStringToArray(coordinates);
  const icon = L.icon({
    iconUrl:
      "https://res.cloudinary.com/dhe9hmzbn/image/upload/v1688643781/marker-icon_avub9w.png",
  });

  return (
    <div>
      {isLoading ? (
        <div>
          <LinearProgress></LinearProgress>
        </div>
      ) : (
        <MapContainer
          center={latlng}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "40rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={latlng} icon={icon}></Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default Maps;
