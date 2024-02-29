<?php

// http://wp-plugin-liam.wsl/wp-json/lmap/v1/data/

class LMap_API
{
    public function __construct()
    {
        add_action('rest_api_init', array($this, 'registerApiEndpoint'));
    }

    public function registerApiEndpoint()
    {
        register_rest_route('lmap/v1', '/data', array(
            'methods' => 'GET',
            'callback' => array($this, 'getData'),
        ));
    }

    public function getData()
    {
        $args = array(
            'post_type' => 'marker',
            'posts_per_page' => -1,
        );
        $posts = get_posts($args);

        foreach ($posts as $key => $post) {
            $data[$key]['popUp'] = $post->post_title;
            $data[$key]['geocode'] = get_post_meta($post->ID, 'latitude_key');
            $data[$key]['geocode'][] = get_post_meta($post->ID, 'longitude_key', true);
        }

        // Return data as JSON response
        return rest_ensure_response($data);
    }
}

new LMap_API();
