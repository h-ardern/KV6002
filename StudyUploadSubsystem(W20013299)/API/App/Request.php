<?php
namespace App;

abstract class Request 
{
    public static function method()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function endpointName()
    {
        $url = $_SERVER["REQUEST_URI"];
        $path = parse_url($url)['path'];
        // Adjust the replacement to match your actual base path, or remove it if unnecessary
        return str_replace("/kv6002/API", "", $path); 
    }

    public static function params()
    {
        return $_REQUEST;
    }
}
