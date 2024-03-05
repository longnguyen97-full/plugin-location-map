// libraries
import { useEffect, useState, useRef } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import markerIcon from "../img/marker-icon.png";
import { Icon } from "leaflet";
import axios from "axios";

const MapSearch = (props) => {
  // set a json url
  const url = window.appLocalizer
    ? `${window.appLocalizer.apiUrl}/lmap/v1/settings/`
    : "http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings/";

  // set a default marker ref
  const defaultMarkerRef = useRef(null);

  // add a provider
  const provider = new OpenStreetMapProvider({
    params: {
      email: props.email,
    },
  });

  // create a default marker
  const defaultMarker = new Icon({
    iconUrl: markerIcon, // Provide the correct path to your default icon
    iconSize: [38, 38], // Adjust the size of the icon
  });
  // Save a reference to the default marker
  defaultMarkerRef.current = defaultMarker;

  // create a geosearch control
  const searchControl = new GeoSearchControl({
    provider: provider,
    showMarker: true,
    marker: {
      icon: defaultMarker,
      draggable: false,
    },
  });

  // search to a place and update default marker for it
  const updateMarkerOnSearch = () => {
    const inputElement = document.querySelector(
      "div.leaflet-control-geosearch.leaflet-geosearch-button form input.glass"
    );
    inputElement.addEventListener("keydown", handleUpdateMarkerOnSearch);
    const resultElement = document.querySelector(
      "div.leaflet-control-geosearch.leaflet-geosearch-button form div.results"
    );
    resultElement.addEventListener("click", handleUpdateMarkerOnSearch);
  };
  const handleUpdateMarkerOnSearch = async (event) => {
    if (event.key === "Enter") {
      // Execute your search logic here
      const response = await axios.get(url);
      const data = response.data;

      // Change the custom icon via default marker ref
      if (data.marker_path) {
        defaultMarkerRef.options.iconUrl = data.marker_path;
      }
    }
  };

  // start to use geosearch control on the map
  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);

    updateMarkerOnSearch();

    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default MapSearch;
