// libraries
import React from "react";
import markerIcon from "./img/marker-icon.png";
import "./App.css";
import "./style.css";
import axios from "axios";

// react-leaflet library
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    // manage states
    this.state = {
      data: null,
      loading: true,
      error: null,
      customIcon: new Icon({
        iconUrl: markerIcon,
        iconSize: [38, 38],
      }),
      url: "http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings/",
    };
  }

  componentDidMount() {
    // appLocalizer is not undefined: access custom url
    if (window.appLocalizer) {
      this.setState({ url: `${window.appLocalizer.apiUrl}/lmap/v1/settings` });
    }
    // fetch data from api
    this.getSettings();
  }

  getSettings() {
    axios
      .get(this.state.url)
      .then((response) => {
        // handle successful response
        this.setState({ data: response.data });
      })
      .catch((error) => {
        // handle error
        this.setState({ error: error.message });
      })
      .finally(() => {
        // always executed
        this.setState({ loading: false });
      });
  }

  render() {
    const { customIcon, data, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <MapContainer center={data.default_geocode} zoom={8}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        {data.markers.map((marker, key) => (
          <Marker key={key} position={marker.geocode} icon={customIcon}>
            <Popup>
              <h2>{marker.title}</h2>
              <p>{marker.content}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
}

export default App;
