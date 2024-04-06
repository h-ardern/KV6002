<?php
namespace App;
/**
 * Abstract class for handling HTTP requests.
 *
 * This class provides static methods to retrieve information about the current HTTP request,
 * such as the request method, requested endpoint name, and request parameters.
 *
 * @author Odera Anakpe
 */
abstract class Request
{
    /**
     * Get the HTTP request method (GET, POST, etc.).
     *
     * @return string The HTTP request method.
     */
    public static function method()
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    /**
     * Get the name of the requested endpoint.
     *
     * @return string The name of the requested endpoint.
     */
    public static function endpointName()
    {
        $url = $_SERVER["REQUEST_URI"];
        $path = parse_url($url)['path'];
        return str_replace(Constants::BASE_PATH, "", $path);
    }
    /**
     * Get the request parameters.
     *
     * @return array The request parameters.
     */
    public static function params()
    {
        return array_change_key_case($_REQUEST, CASE_LOWER);
    }

}