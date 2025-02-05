<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App;

abstract class Router
{

    public static function routeRequest()
    {
        try {
            switch (Request::endpointName()) {
                case '/':
                case '/developer':
                case '/developer/':
                    $endpoint = new \App\EndpointControllers\Developer();
                    break;
                case '/token':
                case '/token/':
                    $endpoint = new \App\EndpointControllers\Token();
                    break;
                case '/userdata':
                case '/userdata/':
                    $endpoint = new \App\EndpointControllers\UserData();
                    break;
                case '/createaccount':
                case '/createaccount/':
                    $endpoint = new \App\EndpointControllers\CreateAccount();
                    break;
                case '/country':
                case '/country/':
                    $endpoint = new \App\EndpointControllers\Country();
                    break;     
                case '/interests':
                case '/interests/':
                    $endpoint = new \App\EndpointControllers\Interests();
                    break;           
                default:
                    throw new ClientError(404);
            }
        } catch (ClientError $e) {
            $data['message'] = $e->getmessage();
            $endpoint = new \App\EndpointControllers\Endpoint([$data]);
        }
        return $endpoint;
    }
}
