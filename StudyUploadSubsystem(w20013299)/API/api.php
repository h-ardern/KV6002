<?php

 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "config/exceptionHandler.php";
set_exception_handler("exceptionHandler");

include "config/autoloader.php";
spl_autoload_register("autoloader");



$url = $_SERVER["REQUEST_URI"];


$response = new \App\Response();

try{

switch (\App\Request::endpointName()) {
    case '/StudyUpload':
    case '/StudyUpload/':
        $endpoint = new \App\StudyUpload();
        break;
        case '/GetStudies':
            case '/GetStudies/':
                $endpoint = new \App\GetStudies();
                break;
                case '/GetStudiesByClient':
                    case '/GetStudiesByClient/':
                        $endpoint = new \App\GetStudiesByClient();
                        break;
                        case '/DeleteStudy':
                            case '/DeleteStudy/':
                                $endpoint = new \App\DeleteStudy();
                                break;
                               
        
    default:
        throw new \App\ClientError(404);
            }
}catch (\App\ClientError $e) {
    $data['message'] = $e->getMessage();
    $endpoint = new \App\Endpoint($data);
}
 
$data = $endpoint->getData();
 
$response->outputJSON($data);