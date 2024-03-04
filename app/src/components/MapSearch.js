import { useEffect, useState, useRef } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import markerIcon from "../img/marker-icon.png";
import { Icon } from "leaflet";
import axios from "axios";

const MapSearch = (props) => {
  const customIconRef = useRef(null);

  const provider = new OpenStreetMapProvider({
    params: {
      email: props.email,
    },
  });

  const [url, setUrl] = useState(
    "http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings/"
  );
  const [data, setData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  if (window.appLocalizer) {
    setUrl(`${window.appLocalizer.apiUrl}/lmap/v1/settings`);
  }
  const getSettings = () => {
    axios
      .get(url)
      .then((response) => {
        // handle successful response
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error.message);
        setError(error.message);
      })
      .finally(() => {
        // always executed
        setLoading(false);
      });
  };

  const getMarkerIcon = (marker, commonMarker, defaultMarker) => {
    var markerIcon = defaultMarker;
    if (commonMarker) {
      markerIcon = commonMarker;
    }
    if (marker) {
      console.log(marker);
      markerIcon = marker;
    }
    return markerIcon;
  };

  const customIcon = new Icon({
    iconUrl: markerIcon, // Provide the correct path to your custom icon
    iconSize: [38, 38], // Adjust the size of the icon
  });

  // Save a reference to the custom icon
  customIconRef.current = customIcon;

  const searchControl = new GeoSearchControl({
    provider: provider,
    showMarker: true,
    marker: {
      icon: customIcon,
      draggable: false,
    },
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);

    //
    const inputElement = document.querySelector(
      "div.leaflet-control-geosearch.leaflet-geosearch-button form input.glass"
    );
    inputElement.addEventListener("keydown", updateMarkerOnSearch);
    const resultElement = document.querySelector(
      "div.leaflet-control-geosearch.leaflet-geosearch-button form div.results"
    );
    resultElement.addEventListener("click", updateMarkerOnSearch);
    // alert(geosearchEl);
    return () => map.removeControl(searchControl);
  }, []);

  const updateMarkerOnSearch = async (event) => {
    if (event.key === "Enter") {
      // Execute your search logic here
      console.log("Enter key pressed. Perform search...");
      var url = "http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings";
      if (window.appLocalizer) {
        url = `${window.appLocalizer.apiUrl}/lmap/v1/settings`;
      }
      const response = await axios.get(url);
      const data = response.data;

      // Change the custom icon
      customIcon.options.iconUrl = data.marker_path;
      customIcon.options.iconSize = data.marker_size;
    }
  };

  return null;
};

export default MapSearch;
