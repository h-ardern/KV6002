<?php
 
namespace App\EndpointControllers;

class UserData extends Endpoint 
{
    public function __construct()
    {
        $id = $this->validateToken();
        
        $this->checkUserExists($id);
 
        switch(\App\Request::method()) 
        {
            case 'GET':
                $data = $this->getUserData($id);
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
 
        return $decodedJWT->sub;
    }
 
    private function getUserData($id)
    {

        $this->checkUserExists($id);
        $sql = "SELECT * FROM account WHERE id = :id";
        $sqlParams = [':id' => $id];

        $dbConn = new \App\Database(USERS_DATABASE);
        
        $data = $dbConn->executeSQL($sql, $sqlParams);
        
        return $data;        
    }


    private function checkUserExists($id)
    {
        $dbConn = new \App\Database(USERS_DATABASE);
        $sql = "SELECT id FROM account WHERE id = :id";
        $sqlParams = [':id' => $id];
        $data = $dbConn->executeSQL($sql, $sqlParams);
        if (count($data) != 1) {
            throw new \App\ClientError(401);
        }
    }
}
