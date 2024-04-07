<?php
/**
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class Interests extends Endpoint
{
    public function __construct()
    {
        $id = $this->validateToken();
        switch (\App\Request::method()) {
            case 'GET':
                $data = $this->getInterests($id);
                break;
            case 'POST':
                $data = $this->postInterests($id);
                break;
            default:
                throw new \App\ClientError(405);
                break;
        }
        parent::__construct($data);
    }

    private function validateToken()
    {
        $secretkey = SECRET;
        $jwt = \App\REQUEST::getBearerToken();
        try {
            $decodedJWT = \FIREBASE\JWT\JWT::decode($jwt, new \FIREBASE\JWT\Key($secretkey, 'HS256'));
        } catch (\Exception $e) {
            throw new \App\ClientError(401);
        }
        if (!isset($decodedJWT->exp) || !isset($decodedJWT->sub)) {
            throw new \App\ClientError(401);
        }
        if ($_SERVER['HTTP_HOST'] != $decodedJWT->iss) {
            throw new \App\ClientError(401);
        }
        return $decodedJWT->sub;
    }

    private function getInterests($id)
    {
        $dbConn = new \App\Database(USERS_DATABASE);
        $sql = "SELECT interestID FROM participantinterests WHERE userID = :id";
        $sqlParams = [':id' => $id];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        return $data;
    }

    private function postInterests($id)
    {
        if (!isset(\App\REQUEST::params()['interestID'])) {
            throw new \App\ClientError(422);
        }
        $interest_id = \App\REQUEST::params()['interestID'];
        if (!is_numeric($interest_id) || $interest_id < 1 || $interest_id > 5) {
            throw new \App\ClientError(422);
        }
        $dbConn = new \App\Database(USERS_DATABASE);
        $sqlParams = [':id' => $id, 'interestID' => $interest_id];
        $sql = "SELECT * FROM participantinterests WHERE userID = :id AND interestID = :interestID";
        $data = $dbConn->executeSQL($sql, $sqlParams);
        if (count($data) === 0) {
            $sql = "INSERT INTO participantinterests (userID, interestID) VALUES (:id, :interestID)";
            $data = $dbConn->executeSQL($sql, $sqlParams);
        }
        return [];
    }
}