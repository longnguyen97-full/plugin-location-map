<?php

class LMap_Metabox
{
    public function __construct()
    {
        add_action('add_meta_boxes', array($this, 'addLatitudeMetaBox'));
        add_action('save_post', array($this, 'saveLatitudeMetaData'));
        // --------------------------------------------------
        add_action('add_meta_boxes', array($this, 'addLongitudeMetaBox'));
        add_action('save_post', array($this, 'saveLongitudeMetaData'));
        // --------------------------------------------------
        add_action('add_meta_boxes', array($this, 'addMarkerMetaBox'));
        add_action('save_post', array($this, 'saveMarkerMetaData'));
    }

    public function addLatitudeMetaBox()
    {
        add_meta_box(
            'lmap_latitude_key',   // Unique ID for the meta box
            'Latitude',      // Title of the meta box
            array($this, 'render_latitude_meta_box'), // Callback function to render the meta box content
            'marker',     // Custom post type to add the meta box to
            'normal',               // Context: 'normal', 'advanced', or 'side'
            'high'                  // Priority: 'high', 'core', 'default', or 'low'
        );
    }

    public function render_latitude_meta_box($post)
    {
        // Retrieve existing meta data if available
        $meta_value = get_post_meta($post->ID, 'lmap_latitude_key', true);

        // Output the meta box HTML
        ?>
        <input type="text" id="latitude_meta_field" name="latitude_meta_field" value="<?php echo esc_attr($meta_value); ?>">
        <?php
    }

    public function saveLatitudeMetaData($post_id)
    {
        // Check if the meta data should be saved
        if (isset($_POST['latitude_meta_field'])) {
            // Sanitize and save the meta data
            $meta_value = sanitize_text_field($_POST['latitude_meta_field']);
            update_post_meta($post_id, 'lmap_latitude_key', $meta_value);
        }
    }

    // --------------------------------------------------
    public function addLongitudeMetaBox()
    {
        add_meta_box(
            'lmap_longitude_key',   // Unique ID for the meta box
            'Longitude',      // Title of the meta box
            array($this, 'render_longitude_meta_box'), // Callback function to render the meta box content
            'marker',     // Custom post type to add the meta box to
            'normal',               // Context: 'normal', 'advanced', or 'side'
            'high'                  // Priority: 'high', 'core', 'default', or 'low'
        );
    }

    public function render_longitude_meta_box($post)
    {
        // Retrieve existing meta data if available
        $meta_value = get_post_meta($post->ID, 'lmap_longitude_key', true);

        // Output the meta box HTML
        ?>
        <input type="text" id="longitude_meta_field" name="longitude_meta_field" value="<?php echo esc_attr($meta_value); ?>">
        <?php
    }

    public function saveLongitudeMetaData($post_id)
    {
        // Check if the meta data should be saved
        if (isset($_POST['longitude_meta_field'])) {
            // Sanitize and save the meta data
            $meta_value = sanitize_text_field($_POST['longitude_meta_field']);
            update_post_meta($post_id, 'lmap_longitude_key', $meta_value);
        }
    }

    // --------------------------------------------------
    public function addMarkerMetaBox()
    {
        add_meta_box(
            'lmap_marker_key',   // Unique ID for the meta box
            'Marker',      // Title of the meta box
            array($this, 'render_marker_meta_box'), // Callback function to render the meta box content
            'marker',     // Custom post type to add the meta box to
            'normal',               // Context: 'normal', 'advanced', or 'side'
            'high'                  // Priority: 'high', 'core', 'default', or 'low'
        );
    }

    public function render_marker_meta_box($post)
    {
        // Retrieve existing meta data if available
        $meta_value = get_post_meta($post->ID, 'lmap_marker_key', true);

        // Output the meta box HTML
        ?>
        <div class="d-flex align-items-center gap-10">
            <div id="lmap-select-media-box"></div>
            <div id="lmap-preview-media-box">
                <?php
                if (!empty($meta_value)) {
                    ?>
                    <img src="<?php echo $meta_value; ?>" alt="preview-media-box" width="38" height="38">
                    <?php
                }
                ?>
            </div>
            <input type="hidden" id="marker_meta_field" name="marker_meta_field" value="">
        </div>
        <?php
    }

    public function saveMarkerMetaData($post_id)
    {
        // Check if the meta data should be saved
        if (isset($_POST['marker_meta_field'])) {
            // Sanitize and save the meta data
            $meta_value = sanitize_text_field($_POST['marker_meta_field']);
            update_post_meta($post_id, 'lmap_marker_key', $meta_value);
        }
    }
}

new LMap_Metabox();