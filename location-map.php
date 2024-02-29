<?php
/*
Plugin Name: Location Map
Description: This is a demo plugin.
Version: 1.0
Author: Liam
Author URI: https://automattic.com/wordpress-plugins/
Requires at least: 5.8
Requires PHP: 5.6.20
License: GPLv2 or later
Text Domain: lmap
*/

// Plugin code goes here

// Make sure we don't expose any info if called directly
if (!function_exists('add_action')) {
    echo 'Hi there! I\'m just a plugin, not much I can do when called directly.';
    exit;
}

define('LMAP__PLUGIN_PATH', plugin_dir_path(__FILE__));
define('LMAP__PLUGIN_URL', plugin_dir_url(__FILE__));

include_once 'setup.php';

// register_activation_hook( __FILE__, 'wpdocs_myplugin_activate' );
