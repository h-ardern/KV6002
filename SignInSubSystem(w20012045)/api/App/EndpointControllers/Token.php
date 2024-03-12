<?php

namespace App\EndpointControllers;


class Token extends Endpoint
{
    /**
     * @var string SQL query to fetch user id and password based on username.
     */
    private $sql = "SELECT id, password FROM account WHERE username = :username";


    private $sqlParams = [];

    public function __construct() {

        switch(\App\Request::method()) 
        {
            case 'GET':
            case 'POST':
                $this->checkAllowedParams();
                $dbConn = new \App\Database(USERS_DATABASE);
    
                if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW'])) {
                    throw new \App\ClientError(401);
                }
                if (empty(trim($_SERVER['PHP_AUTH_USER'])) || empty(trim($_SERVER['PHP_AUTH_PW']))) {
                    throw new \App\ClientError(401);
                }
              
                $this->sqlParams[":username"] = $_SERVER['PHP_AUTH_USER'];
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);

                if (count($data) != 1) {
                    throw new \App\ClientError(401);
                }

                if (!password_verify($_SERVER['PHP_AUTH_PW'], $data[0]['password'])) {
                    throw new \App\ClientError(401);
                }

                $token = $this->generateJWT($data[0]['id']);        
                $data = ['token' => $token];
 
                parent::__construct($data);
                break;
            default:
                throw new \App\ClientError(405);
                break;
        }
    }

    private function generateJWT($id) {
 
        $secretKey = SECRET;

        $payload = [
            'sub' => $id,
            'exp' => strtotime('+30 mins', time()),
            'iat' => time(),
            'iss' => $_SERVER['HTTP_HOST']
            ];

        $jwt = \FIREBASE\JWT\JWT::encode($payload, $secretKey, 'HS256');
  
        return $jwt;
    }

}