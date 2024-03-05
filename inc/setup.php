<?php

/**
 * Enqueue scripts (CSS, JS, etc)
 */
add_action('wp_enqueue_scripts', 'lmap_enqueue_scripts');
function lmap_enqueue_scripts()
{
    // JS
    wp_enqueue_script('main-bundle', LMAP__PLUGIN_URL . 'app/dist/main.bundle.js', array('jquery', 'wp-element'), wp_rand(), true);
    // Localize for main-bundle
    wp_localize_script('main-bundle', 'appLocalizer', array(
        'apiUrl' => home_url('/wp-json'),
        'nonce'  => wp_create_nonce('wp_rest'),
    ));
}

add_action('admin_enqueue_scripts', 'lmap_admin_enqueue_scripts');
add_action('admin_enqueue_scripts', 'lmap_admin_enqueue_scripts');
function lmap_admin_enqueue_scripts()
{
    // JS
    wp_enqueue_script('admin-bundle', LMAP__PLUGIN_URL . 'app/dist/admin.bundle.js', array('jquery', 'wp-element'), wp_rand(), true);
    wp_enqueue_script('bootstrap', LMAP__PLUGIN_URL . 'assets/bootstrap/js/bootstrap.min.js', array('jquery'), wp_rand(), true);
    wp_enqueue_script('script', LMAP__PLUGIN_URL . 'assets/js/script.js', array('jquery'), wp_rand(), true);
    // CSS
    wp_enqueue_style('bootstrap', LMAP__PLUGIN_URL . 'assets/bootstrap/css/bootstrap.min.css', null, wp_rand(), false);
    wp_enqueue_style('style', LMAP__PLUGIN_URL . 'assets/css/style.css', null, wp_rand(), false);
    // Localize for admin-bundle
    wp_localize_script('admin-bundle', 'appLocalizer', array(
        'apiUrl' => home_url('/wp-json'),
        'nonce'  => wp_create_nonce('wp_rest'),
    ));
    // Media popup
    wp_enqueue_media();
}

/**
 * Register a custom post type called "Location Map".
 *
 * @see get_post_type_labels() for label keys.
 */
add_action('init', 'lmap_post_type_init');
function lmap_post_type_init()
{
    $labels = array(
        'name'                  => _x('Markers', 'Post type general name', 'lmap'),
        'singular_name'         => _x('Marker', 'Post type singular name', 'lmap'),
        'menu_name'             => _x('Location Map', 'Admin Menu text', 'lmap'),
        'name_admin_bar'        => _x('Marker', 'Add New on Toolbar', 'lmap'),
        'add_new'               => __('Add New', 'lmap'),
        'add_new_item'          => __('Add New Marker', 'lmap'),
        'new_item'              => __('New Marker', 'lmap'),
        'edit_item'             => __('Edit Marker', 'lmap'),
        'view_item'             => __('View Marker', 'lmap'),
        'all_items'             => __('All Markers', 'lmap'),
        'search_items'          => __('Search Markers', 'lmap'),
        'parent_item_colon'     => __('Parent Markers:', 'lmap'),
        'not_found'             => __('No markers found.', 'lmap'),
        'not_found_in_trash'    => __('No markers found in Trash.', 'lmap'),
        'featured_image'        => _x('Marker Cover Image', 'Overrides the "Featured Image" phrase for this post type. Added in 4.3', 'lmap'),
        'set_featured_image'    => _x('Set cover image', 'Overrides the "Set featured image" phrase for this post type. Added in 4.3', 'lmap'),
        'remove_featured_image' => _x('Remove cover image', 'Overrides the "Remove featured image" phrase for this post type. Added in 4.3', 'lmap'),
        'use_featured_image'    => _x('Use as cover image', 'Overrides the "Use as featured image" phrase for this post type. Added in 4.3', 'lmap'),
        'archives'              => _x('Marker archives', 'The post type archive label used in nav menus. Default "Post Archives". Added in 4.4', 'lmap'),
        'insert_into_item'      => _x('Insert into marker', 'Overrides the "Insert into post"/"Insert into page" phrase (used when inserting media into a post). Added in 4.4', 'lmap'),
        'uploaded_to_this_item' => _x('Uploaded to this marker', 'Overrides the "Uploaded to this post"/"Uploaded to this page" phrase (used when viewing media attached to a post). Added in 4.4', 'lmap'),
        'filter_items_list'     => _x('Filter markers list', 'Screen reader text for the filter links heading on the post type listing screen. Default "Filter posts list"/"Filter pages list". Added in 4.4', 'lmap'),
        'items_list_navigation' => _x('Markers list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default "Posts list navigation"/"Pages list navigation". Added in 4.4', 'lmap'),
        'items_list'            => _x('Markers list', 'Screen reader text for the items list heading on the post type listing screen. Default "Posts list"/"Pages list". Added in 4.4', 'lmap'),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'marker'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => null,
        'supports'           => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments'),
        'menu_icon'          => LMAP__PLUGIN_URL . 'assets/images/icon.webp',
    );

    register_post_type('marker', $args);
}

/**
 * Register settings page
 */
add_action('admin_menu', 'lmap_settings_page_init');
function lmap_settings_page_init()
{
    // Add submenu page to your custom post type menu
    add_submenu_page(
        'edit.php?post_type=marker', // Parent menu slug (custom post type)
        'Settings', // Page title
        'Settings', // Menu title
        'manage_options', // Capability required to access the page
        'lmap_settings_page', // Page slug
        'lmap_settings_page_render' // Callback function to render the page content
    );
}

/**
 * A callback function for rendering data on settings page
 */
function lmap_settings_page_render()
{
    // Render your settings page content here
    echo '<div id="root-admin"></div>';
}

/**
 * A shortcode for rendering data on user view
 */
add_shortcode('lmap_shortcode', 'lmap_shortcode_init');
function lmap_shortcode_init()
{
    // Generate the content you want to display
    return '<div id="root">root</div>';
}
