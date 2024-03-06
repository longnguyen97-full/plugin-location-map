module.exports = global.config = {
  api: window.appLocalizer
    ? `${window.appLocalizer.apiUrl}/lmap/v1/settings/`
    : "http://localhost:81/wp-plugin-liam/wp-json/lmap/v1/settings/",
};
