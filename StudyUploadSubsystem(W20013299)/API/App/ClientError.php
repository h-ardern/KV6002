<?php


 namespace App;

 class ClientError extends \Exception {
     public function __construct($code) {
         http_response_code($code); 
         parent::__construct($this->errorResponses($code), $code);
     }
 
     public function errorResponses($code) {
         switch ($code) {
             case 401:
                 return 'Unauthorized';
             case 404:
                 return 'Endpoint Not Found';
             case 405:
                 return 'Method Not Allowed';
             case 422:
                 return 'Unprocessable Entity';
             default:
                 http_response_code(500); 
                 return 'Unknown Error Code: ' . $code;
         }
     }
 }
 