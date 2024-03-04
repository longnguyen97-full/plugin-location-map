<?php

// http://wp-plugin-liam.wsl/wp-json/lmap/v1/settings/

class LMap_Settings_RestRoute
{
    public function __construct()
    {
        add_action('rest_api_init', array($this, 'createRestRoutes'));
    }

    public function createRestRoutes()
    {
        register_rest_route('lmap/v1', '/settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'getSettings'),
            'permission_callback' => array($this, 'getSettingsPermission'),
        ));

        register_rest_route('lmap/v1', '/settings', array(
            'methods' => 'POST',
            'callback' => array($this, 'saveSettings'),
            'permission_callback' => array($this, 'saveSettingsPermission'),
        ));
    }

    public function getSettings()
    {
        // set default geocode
        $latitude = 0 ?: get_option('lmap_default_latitude');
        $longitude = 0 ?: get_option('lmap_default_longitude');
        $response['default_geocode'] = array($latitude, $longitude);

        // set markers
        $args = array(
            'post_type' => 'marker',
            'posts_per_page' => -1,
        );
        $posts = get_posts($args);
        foreach ($posts as $key => $post) {
            $response['markers'][$key]['title'] = $post->post_title;
            $response['markers'][$key]['content'] = $post->post_content;
            $response['markers'][$key]['geocode'] = get_post_meta($post->ID, 'lmap_latitude_key');
            $response['markers'][$key]['geocode'][] = get_post_meta($post->ID, 'lmap_longitude_key', true);
            $response['markers'][$key]['marker'] = get_post_meta($post->ID, 'lmap_marker_key', true);
        }

        // set zoom
        $zoom = 0 ?: get_option('lmap_default_zoom');
        $response['default_zoom'] = $zoom;

        // set openstreetmap email
        $email = 0 ?: get_option('lmap_openstreetmap_email');
        $response['openstreetmap_email'] = $email;

        // set custom marker
        $marker_path = 0 ?: get_option('lmap_marker_path');
        $response['marker_path'] = $marker_path;

        // set marker size
        $marker_width = 0 ?: get_option('lmap_marker_width');
        $marker_height = 0 ?: get_option('lmap_marker_height');
        $response['marker_size'] = [$marker_width, $marker_height];

        return rest_ensure_response($response);
    }

    public function getSettingsPermission()
    {
        return true;
    }

    public function saveSettings($request)
    {
        $latitude = sanitize_text_field($request['latitude']);
        $longitude = sanitize_text_field($request['longitude']);
        $zoom = sanitize_text_field($request['zoom']) ?: 0;
        $email = sanitize_text_field($request['email']);
        $marker_path = sanitize_text_field($request['markerPath']);
        $marker_width = sanitize_text_field($request['markerWidth']) ?: 0;
        $marker_height = sanitize_text_field($request['markerHeight']) ?: 0;

        update_option('lmap_default_latitude', $latitude);
        update_option('lmap_default_longitude', $longitude);
        update_option('lmap_default_zoom', $zoom);
        update_option('lmap_openstreetmap_email', $email);
        update_option('lmap_marker_path', $marker_path);
        update_option('lmap_marker_width', $marker_width);
        update_option('lmap_marker_height', $marker_height);

        return rest_ensure_response('success | latitude: ' . $latitude . ' | longitude: ' . $longitude .  ' | zoom: ' . $zoom . ' | email: ' . $email . ' | marker path: ' . $marker_path . ' | marker width: ' . $marker_width . ' | marker height: ' . $marker_height);
    }

    public function saveSettingsPermission()
    {
        return true;
    }
}

new LMap_Settings_RestRoute();
