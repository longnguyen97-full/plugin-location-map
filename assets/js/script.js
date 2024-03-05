(function ($) {
  $(document).ready(function () {
    /**
     * allow access media from post editor
     */
    // Add a select media button
    $("#lmap-select-media-box").html(
      `<button type="button" class="button button-primary" id="lmap-select-media-button">Select Marker</button>`
    );

    // Define behavior for your button
    $("#lmap-select-media-button").on("click", function () {
      // behavior here
      var mediaUploader = wp.media({
        frame: "select",
        title: "Select Media",
        multiple: false,
        library: {
          type: "image", // Change this to 'audio', 'video', or 'file' for different media types
        },
      });

      mediaUploader.on("select", function () {
        var attachment = mediaUploader
          .state()
          .get("selection")
          .first()
          .toJSON();
        // Do something with the selected media attachment
        console.log(attachment);
        // Display preview of selected image
        if (attachment.type === "image") {
          var preview =
            '<img src="' +
            attachment.url +
            '" alt="' +
            attachment.alt +
            '" width="38' +
            '" height="38">';
          $("#lmap-preview-media-box").html(preview);
        }
        // Save the selected image URL to a hidden input field
        $("#marker_meta_field").val(attachment.url);
      });

      mediaUploader.open();
    });
  });
})(jQuery);
