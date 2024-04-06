<?php

namespace App;

class Response
{
    public function __construct()
    {
        
    }

    public static function outputHeaders()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
    }

    public function outputJSON($data)
    {
        echo json_encode($data);
    }
}

Response::outputHeaders();


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    
    http_response_code(204); 
    exit;
}
