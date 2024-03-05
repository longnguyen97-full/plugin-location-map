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

    // avoid error: insecure http request
    if (window.location.host === "wp-plugin-liam.wsl") {
      var devUrl = "http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings/";
    }
    // manage states
    this.state = {
      data: null,
      loading: true,
      error: null,
      url: devUrl ?? "", // for dev on react
      showSearch: true,
      mapRef: React.createRef(),
      markerSize: [38, 38],
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
    const { data, loading, error, showSearch, mapRef, markerSize } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }

    return (
      <MapContainer
        ref={mapRef}
        center={data.default_geocode}
        zoom={data.default_zoom}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        {data.markers.map((marker, key) => (
          <Marker
            key={key}
            position={marker.geocode}
            icon={
              new Icon({
                iconUrl: this.getMarkerIcon(
                  marker.marker,
                  data.marker_path,
                  markerIcon
                ),
                iconSize: data.marker_size ?? markerSize,
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
        {showSearch && <MapSearch email={data.openstreetmap_email} />}
      </MapContainer>
    );
  }
}

export default App;
