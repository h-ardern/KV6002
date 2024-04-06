<?php

namespace App;

/**
 * Reroutes incoming API requests
 *
 * This class reroutes requests from the single point of entry to the
 * specified endpoint
 *
 * @author Odera Anakpe
 */
abstract class Router
{
    /**
     * Route the incoming request to the appropriate endpoint.
     *
     * @return Endpoints\EndpointBase The instantiated endpoint based on the request.
     * @throws ClientError If the requested endpoint is not found (HTTP 404).
     */
    public static function routeRequest()
    {
        try {
            switch (strtolower(Request::endpointName())) {
                case '/':
                case '/developer':
                case '/developer/':
                    $endpoint = new Endpoints\Developer();
                    break;
                case '/country':
                case '/country/':
                    $endpoint = new Endpoints\Country();
                    break;
                case '/participants':
                case '/participants/':
                    $endpoint = new Endpoints\Participants();
                    break;
                case '/search':
                case '/search/':
                    $endpoint = new Endpoints\Search();
                    break;
                case '/content':
                case '/content/':
                    $endpoint = new Endpoints\Content();
                    break;
                case '/interests':
                case '/interests/':
                    $endpoint = new Endpoints\Interests();
                    break;
                default:
                    throw new ClientError(404);
                    break;
            }
        } catch (ClientError $e) {
            $data = ['message' => $e->getMessage()];
            $endpoint = new Endpoints\EndpointBase($data);
        }

        return $endpoint;
    }
}