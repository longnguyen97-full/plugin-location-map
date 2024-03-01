import { useEffect } from "react";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import markerIcon from "../img/marker-icon.png";
import { Icon } from "leaflet";

const MapSearch = (props) => {
  const provider = new OpenStreetMapProvider({
    params: {
      email: props.email,
    },
  });

  // Create a custom icon
  const customIcon = new Icon({
    iconUrl: markerIcon, // Provide the correct path to your custom icon
    iconSize: [38, 38], // Adjust the size of the icon
  });

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
    return () => map.removeControl(searchControl);
  }, []);

  return null;
};

export default MapSearch;
