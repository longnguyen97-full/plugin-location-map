// libraries
import React from "react";
import axios from "axios";

// components
import InputGeocode from "./InputGeocode";

class FormSettings extends React.Component {
  constructor(props) {
    super(props);

    // manage states
    this.state = {
      latitude: 0,
      longitude: 0,
      loader: "Save Settings",
      errors: {},
      url: `${window.appLocalizer.apiUrl}/lmap/v1/settings`,
      inputInfo: {
        inputLatitude: {
          id: "latitude",
          label: "Latitude",
        },
        inputLongitude: {
          id: "longitude",
          label: "Longitude",
        },
      },
    };
  }

  componentDidMount() {
    // fetch data from api
    this.getDefaultGeocode();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getDefaultGeocode = () => {
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
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { latitude, longitude, url } = this.state;
    const errors = {};

    // validate data
    if (latitude.trim() === "") {
      errors.latitude = "Latitude is required";
    }
    if (longitude.trim() === "") {
      errors.longitude = "Longitude is required";
    }
    if (isNaN(latitude)) {
      errors.latitude = "Latitude must be a number";
    }
    if (isNaN(longitude)) {
      errors.longitude = "Longitude must be a number";
    }

    // handle data
    if (Object.keys(errors).length === 0) {
      // Form is valid, submit data
      this.setState({ loader: "Saving..." });
      this.setState({ errors: {} });
      axios
        .post(
          url,
          {
            latitude: latitude,
            longitude: longitude,
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

  resetForm = () => {
    this.setState({ latitude: "", longitude: "" });
  };

  render() {
    const { latitude, longitude, errors, loader, inputInfo } = this.state;

    return (
      <form id="lmap-settings-form" onSubmit={(e) => this.handleSubmit(e)}>
        <h3>Set default Geocode</h3>
        <InputGeocode
          label={inputInfo.inputLatitude.label}
          id={inputInfo.inputLatitude.id}
          name={inputInfo.inputLatitude.id}
          value={latitude}
          onChange={this.handleChange}
        ></InputGeocode>
        {errors.latitude && (
          <div className="alert alert-danger" role="alert">
            {errors.latitude}
          </div>
        )}
        <InputGeocode
          label={inputInfo.inputLongitude.label}
          id={inputInfo.inputLongitude.id}
          name={inputInfo.inputLongitude.id}
          value={longitude}
          onChange={(e) => {
            this.setState({ longitude: e.target.value });
          }}
        ></InputGeocode>
        {errors.longitude && (
          <div className="alert alert-danger" role="alert">
            {errors.longitude}
          </div>
        )}
        <p className="submit">
          <button type="submit" className="btn btn-primary">
            {loader}
          </button>
          &nbsp;
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.resetForm}
          >
            Clear Data
          </button>
        </p>
      </form>
    );
  }
}

export default FormSettings;
