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
        $latitude = 0 ?: get_option('default_latitude');
        $longitude = 0 ?: get_option('default_longitude');
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
            $response['markers'][$key]['geocode'] = get_post_meta($post->ID, 'latitude_key');
            $response['markers'][$key]['geocode'][] = get_post_meta($post->ID, 'longitude_key', true);
        }

        return rest_ensure_response($response);
    }

    public function getSettingsPermission()
    {
        return true;
    }

    public function saveSettings($req)
    {
        $latitude = sanitize_text_field($req['latitude']);
        $longitude = sanitize_text_field($req['longitude']);

        update_option('default_latitude', $latitude);
        update_option('default_longitude', $longitude);

        return rest_ensure_response('success');
    }

    public function saveSettingsPermission()
    {
        return true;
    }
}

new LMap_Settings_RestRoute();
