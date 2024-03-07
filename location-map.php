<?php
/*
Plugin Name: Location Map
Description: A plugin for settings to render markers on the world map.
Version: 1.0.0
Author: Liam
Author URI: https://github.com/longnguyen97-full
Requires at least: 5.8
Requires PHP: 5.6.20
License: GPLv2 or later
Text Domain: lmap
*/

// Make sure we don't expose any info if called directly
if (!function_exists('add_action')) {
    echo 'Hi there! I\'m just a plugin, not much I can do when called directly.';
    exit;
}

// Define constans
define('LMAP__PLUGIN_PATH', plugin_dir_path(__FILE__));
define('LMAP__PLUGIN_URL', plugin_dir_url(__FILE__));
define('INC', plugin_dir_path(__FILE__) . 'inc/');

// Include module functions and module classes
include_once INC . 'setup.php';
include_once INC . 'classes/class-register-metabox.php';
include_once INC . 'classes/class-settings-rest-route.php';

// Init map data
register_activation_hook(__FILE__,  'init_map_data');
function init_map_data()
{
    update_option('lmap_default_latitude', 0);
    update_option('lmap_default_longitude', 0);
    update_option('lmap_default_zoom', 0);
    // markerSize: width, height
    update_option('lmap_marker_width', 38);
    update_option('lmap_marker_height', 38);
}
