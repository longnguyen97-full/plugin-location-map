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
import Card from "react-bootstrap/Card";

// components
import MapSearch from "./components/MapSearch";

class App extends React.Component {
  constructor(props) {
    super(props);

    // manage states
    this.state = {
      mapData: null,
      loading: true,
      error: null,
      url: global.config.api,
      showSearch: true,
      mapRef: React.createRef(),
      markerSize: [38, 38],
    };
  }

  componentDidMount() {
    // fetch data from api
    this.getSettings();
  }

  getSettings() {
    axios
      .get(this.state.url)
      .then((response) => {
        // handle successful response
        this.setState({ mapData: response.data });
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

  getMarkerIcon(marker, commonMarker, defaultMarker) {
    var markerIcon = defaultMarker;
    if (commonMarker) {
      markerIcon = commonMarker;
    }
    if (marker) {
      markerIcon = marker;
    }
    return markerIcon;
  }

  render() {
    const { mapData, loading, error, showSearch, mapRef, markerSize } =
      this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <MapContainer
        ref={mapRef}
        center={mapData.default_geocode}
        zoom={mapData.default_zoom}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        {mapData.markers &&
          mapData.markers.map((marker, key) => (
            <Marker
              key={key}
              position={marker.geocode}
              icon={
                new Icon({
                  iconUrl: this.getMarkerIcon(
                    marker.marker,
                    mapData.marker_path,
                    markerIcon
                  ),
                  iconSize: mapData.marker_size ?? markerSize,
                })
              }
            >
              <Popup>
                <Card.Body>
                  <Card.Title>
                    <h2>{marker.title}</h2>
                  </Card.Title>
                  <Card.Text>
                    <div dangerouslySetInnerHTML={{ __html: marker.content }} />
                  </Card.Text>
                </Card.Body>
              </Popup>
            </Marker>
          ))}
        {showSearch && <MapSearch email={mapData.openstreetmap_email} />}
      </MapContainer>
    );
  }
}

export default App;
