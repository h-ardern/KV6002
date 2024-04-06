<?php

namespace App\Endpoints;

/**
 * Get interests
 *
 * @author Odera Anakpe
 */

use \App\Request as Request;

class Interests extends EndpointBase
{
    private $sql = "SELECT DISTINCT InterestName as interest
                    FROM interests";
    private $sqlParams = [];

    public function __construct()
    {
        switch (\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $this->buildSQL();
                $dbConn = new \App\Database(\App\Constants::DB_NAME);
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);
                parent::__construct($data);
                break;
            default:
                throw new \App\ClientError(405);
        }
    }

    private function buildSQL()
    {
        if (isset(Request::params()['limit'])) {
            if (!is_numeric(Request::params()['limit']))
                throw new \App\ClientError(422, "expected numeric value for limit");

            $this->sql .= " LIMIT :limit";
            $this->sqlParams[":limit"] = Request::params()['limit'];
        }
    }
}