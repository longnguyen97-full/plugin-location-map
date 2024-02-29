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
    }

    public function addLatitudeMetaBox()
    {
        add_meta_box(
            'latitude_key',   // Unique ID for the meta box
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
        $meta_value = get_post_meta($post->ID, 'latitude_key', true);

        // Output the meta box HTML
        ?>
        <label for="latitude_meta_field">Latitude Meta Field:</label>
        <input type="text" id="latitude_meta_field" name="latitude_meta_field" value="<?php echo esc_attr($meta_value); ?>">
        <?php
    }

    public function saveLatitudeMetaData($post_id)
    {
        // Check if the meta data should be saved
        if (isset($_POST['latitude_meta_field'])) {
            // Sanitize and save the meta data
            $meta_value = sanitize_text_field($_POST['latitude_meta_field']);
            update_post_meta($post_id, 'latitude_key', $meta_value);
        }
    }

    // --------------------------------------------------
    public function addLongitudeMetaBox()
    {
        add_meta_box(
            'longitude_key',   // Unique ID for the meta box
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
        $meta_value = get_post_meta($post->ID, 'longitude_key', true);

        // Output the meta box HTML
        ?>
        <label for="longitude_meta_field">Latitude Meta Field:</label>
        <input type="text" id="longitude_meta_field" name="longitude_meta_field" value="<?php echo esc_attr($meta_value); ?>">
        <?php
    }

    public function saveLongitudeMetaData($post_id)
    {
        // Check if the meta data should be saved
        if (isset($_POST['longitude_meta_field'])) {
            // Sanitize and save the meta data
            $meta_value = sanitize_text_field($_POST['longitude_meta_field']);
            update_post_meta($post_id, 'longitude_key', $meta_value);
        }
    }
}

new LMap_Metabox();
