<?php

namespace App\Endpoints;

/**
 * Get all participants
 *
 * Endpoint returns participants and the studies they are contributing to
 *
 * @author Odera Anakpe
 */

use \App\Request as Request;

class Participants extends EndpointBase
{
    private $sql = "SELECT id, firstname, lastname, Address
                    FROM users
                    WHERE userTypeID = 1";
    private $sqlParams = [];

    public function __construct()
    {
        switch (\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $this->buildSQL();
                $dbConn = new \App\Database(\App\Constants::DB_NAME);
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);
                $data = $this->AddInterests($data, $dbConn);
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
    private function AddInterests($data, $dbConn)
    {
        foreach ($data as $key => $item) {
            $data[$key]['interests']= $this->GetInterests($data[$key]['id'],$dbConn);
        }
        return $data;
    }
    private function GetInterests($id, $dbConn){
        $sql = "SELECT interests.interestName As interest
                FROM participant_interests
                JOIN interests on participant_interests.interestID = interests.id
                WHERE participant_interests.userID = :user_id
               ";
        $sqlParams[":user_id"] = $id;
        $data = $dbConn->executeSQL($sql,$sqlParams);
        return $data;
    }
}