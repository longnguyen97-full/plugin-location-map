// libraries
import React from "react";
import axios from "axios";

// components
import InputGeocode from "./InputGeocode";

// ultilities
import { validateEmail } from "../../helpers";

class FormSettings extends React.Component {
  constructor(props) {
    super(props);

    // manage states
    this.state = {
      latitude: 0,
      longitude: 0,
      zoom: 0,
      email: "",
      loader: "Save Settings",
      errors: {},
      //   url: `${window.appLocalizer.apiUrl}/lmap/v1/settings`,
      url: "https://pegasus.edu.vn/wp-json/lmap/v1/settings",
      inputInfo: {
        inputLatitude: {
          id: "latitude",
          label: "Latitude",
        },
        inputLongitude: {
          id: "longitude",
          label: "Longitude",
        },
        inputZoom: {
          id: "zoom",
          label: "Zoom",
        },
        inputEmail: {
          id: "email",
          label: "Email",
        },
        inputMarker: {
          id: "marker",
          label: "Marker",
        },
        inputMarkerWidth: {
          id: "markerWidth",
          label: "Marker Width",
        },
        inputMarkerHeight: {
          id: "markerHeight",
          label: "Marker Height",
        },
      },
      markerWidth: 0,
      markerHeight: 0,
      markerPath: null,
    };
  }

  componentDidMount() {
    // fetch data from api
    this.fillSettingsData();
  }

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // fill data from DB to fields on settings page
  fillSettingsData = () => {
    axios.get(this.state.url).then((response) => {
      // handle successful response
      if (response.data.default_geocode[0]) {
        this.setState({
          latitude: response.data.default_geocode[0],
        });
      }
      if (response.data.default_geocode[1]) {
        this.setState({
          longitude: response.data.default_geocode[1],
        });
      }
      if (response.data.default_zoom) {
        this.setState({
          zoom: response.data.default_zoom,
        });
      }
      if (response.data.openstreetmap_email) {
        this.setState({
          email: response.data.openstreetmap_email,
        });
      }
      if (response.data.marker_path) {
        this.setState({
          markerPath: response.data.marker_path,
        });
      }
      if (response.data.marker_size[0]) {
        this.setState({
          markerWidth: response.data.marker_size[0],
        });
      }
      if (response.data.marker_size[1]) {
        this.setState({
          markerHeight: response.data.marker_size[1],
        });
      }
    });
  };

  openWPMedia = () => {
    // Check if the WordPress media popup script is available
    if (typeof window.wp !== "undefined" && window.wp.media) {
      // Open the media popup
      const mediaFrame = window.wp.media({
        title: "Select Media",
        multiple: false, // Set to true for multiple file selection
      });

      // Handle media selection
      mediaFrame.on("select", () => {
        const selectedMedia = mediaFrame
          .state()
          .get("selection")
          .first()
          .toJSON();
        console.log("Selected Media:", selectedMedia);
        // Do something with the selected media (e.g., save the URL)
        this.setState({
          markerWidth: 38,
          markerHeight: 38,
          markerPath: selectedMedia.url,
        });
      });

      // Open the media popup
      mediaFrame.open();
    } else {
      console.error("WordPress media uploader is not available");
    }
  };

  removeCustomMarker = () => {
    this.setState({ markerWidth: 38, markerHeight: 38, markerPath: null });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      latitude,
      longitude,
      zoom,
      email,
      markerPath,
      url,
      markerWidth,
      markerHeight,
    } = this.state;
    const errors = {};

    // validate data
    if (latitude.trim() === "") {
      errors.latitude = "Latitude is required";
    }
    if (longitude.trim() === "") {
      errors.longitude = "Longitude is required";
    }
    if (!zoom) {
      this.setState({ zoom: 0 });
    }
    if (!markerWidth) {
      this.setState({ markerWidth: 0 });
    }
    if (!markerHeight) {
      this.setState({ markerHeight: 0 });
    }
    if (isNaN(latitude)) {
      errors.latitude = "Latitude must be a number";
    }
    if (isNaN(longitude)) {
      errors.longitude = "Longitude must be a number";
    }
    if (isNaN(zoom)) {
      errors.zoom = "Zoom must be a number";
    }
    if (email && !validateEmail(email)) {
      errors.email = "Email must be a valid string";
    }
    if (isNaN(markerWidth)) {
      errors.markerWidth = "Width must be a number";
    }
    if (isNaN(markerHeight)) {
      errors.markerHeight = "Height must be a number";
    }

    // handle data
    if (Object.keys(errors).length === 0) {
      // Form is valid, submit data
      this.setState({ loader: "Saving..." });
      this.setState({ errors: {} });
      console.log(zoom);
      axios
        .post(
          url,
          {
            latitude: latitude,
            longitude: longitude,
            zoom: zoom,
            email: email,
            markerPath: markerPath,
            markerWidth: markerWidth,
            markerHeight: markerHeight,
          },
          {
            headers: {
              "content-type": "application/json",
              "X-WP-NONCE": window.appLocalizer.nonce,
            },
          }
        )
        .then((response) => {
          console.log(response);
          setTimeout(() => {
            this.setState({ loader: "Save Settings" });
          }, 500);
        });
    } else {
      // Form is invalid, update state with errors
      this.setState({ errors });
    }
  };

  clearForm = () => {
    this.setState({
      latitude: "",
      longitude: "",
      zoom: "",
      email: "",
      markerPath: null,
      markerWidth: "",
      markerHeight: "",
    });
  };

  render() {
    const {
      latitude,
      longitude,
      zoom,
      email,
      errors,
      loader,
      inputInfo,
      markerPath,
      markerWidth,
      markerHeight,
    } = this.state;

    return (
      <form id="lmap-settings-form" onSubmit={(e) => this.handleSubmit(e)}>
        <div>
          <h3>Set default Geocode</h3>
          <small
            id={inputInfo.inputLatitude.id + "-" + inputInfo.inputLongitude.id}
            class="form-text text-muted"
          >
            Set latitude and longitude to mark center of the map by default.
          </small>
          <InputGeocode
            type={"number"}
            label={inputInfo.inputLatitude.label}
            id={inputInfo.inputLatitude.id}
            name={inputInfo.inputLatitude.id}
            value={latitude}
            onChange={this.handleChange}
            errorMessage={errors.latitude}
          ></InputGeocode>
          <InputGeocode
            type={"number"}
            label={inputInfo.inputLongitude.label}
            id={inputInfo.inputLongitude.id}
            name={inputInfo.inputLongitude.id}
            value={longitude}
            onChange={this.handleChange}
            errorMessage={errors.longitude}
          ></InputGeocode>
        </div>
        <div className="mt-3">
          <h3>Set default zoom</h3>
          <small class="form-text text-muted">
            Set zoom to scale the map in and out, zoom will be 0 by default.
          </small>
          <InputGeocode
            type={"number"}
            label={inputInfo.inputZoom.label}
            id={inputInfo.inputZoom.id}
            name={inputInfo.inputZoom.id}
            value={zoom}
            onChange={this.handleChange}
            errorMessage={errors.zoom}
          ></InputGeocode>
        </div>
        <div className="mt-3">
          <h3>Set OpenStreetMap email</h3>
          <small class="form-text text-muted">
            Set email to use OpenStreetMap on the large requests.
          </small>
          <InputGeocode
            type="email"
            label={inputInfo.inputEmail.label}
            id={inputInfo.inputEmail.id}
            name={inputInfo.inputEmail.id}
            value={email}
            onChange={this.handleChange}
            errorMessage={errors.email}
          ></InputGeocode>
        </div>
        <div className="mt-3">
          <h3>Set custom marker</h3>
          <small class="form-text text-muted">
            Set a custom marker you want to show on the map.
          </small>
          <div className="d-flex align-items-center gap-10 mt-3">
            <button
              type="button"
              class="button button-primary"
              id={inputInfo.inputMarker.id}
              onClick={this.openWPMedia}
            >
              Select Marker
            </button>
            <button
              type="button"
              class="button button-primary"
              id={inputInfo.inputMarker.id + "-remove"}
              onClick={this.removeCustomMarker}
            >
              Remove Marker
            </button>
            {markerPath && (
              <img
                src={markerPath}
                alt={inputInfo.inputMarker.label}
                width={markerWidth}
                height={markerHeight}
                className="vertical-baseline"
              />
            )}
          </div>
          {errors.markerPath && (
            <div className="alert alert-danger" role="alert">
              {errors.markerPath}
            </div>
          )}{" "}
          <InputGeocode
            type="number"
            label={inputInfo.inputMarkerWidth.label}
            id={inputInfo.inputMarkerWidth.id}
            name={inputInfo.inputMarkerWidth.id}
            value={markerWidth}
            onChange={this.handleChange}
            errorMessage={errors.markerWidth}
          ></InputGeocode>
          <InputGeocode
            type="number"
            label={inputInfo.inputMarkerHeight.label}
            id={inputInfo.inputMarkerHeight.id}
            name={inputInfo.inputMarkerHeight.id}
            value={markerHeight}
            onChange={this.handleChange}
            errorMessage={errors.markerHeight}
          ></InputGeocode>
        </div>
        <div className="submit d-flex align-items-center gap-10">
          <button type="submit" className="button button-primary p-2">
            {loader}
          </button>
          <button
            type="button"
            className="button button-primary p-2"
            onClick={this.clearForm}
          >
            Clear Form
          </button>
        </div>
      </form>
    );
  }
}

export default FormSettings;
