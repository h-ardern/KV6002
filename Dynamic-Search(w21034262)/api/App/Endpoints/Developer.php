<?php

namespace App\Endpoints;

/**
 * Endpoint returns details of the API developer
 *
 * @author Odera Anakpe
 */
class Developer extends EndpointBase
{
    public function __construct()
    {
        switch (\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $data['id'] = "W21034262";
                $data['name'] = "Odera Anakpe";
                parent::__construct($data);
                break;
            default:
                throw new \App\ClientError(405);
        }
    }
}