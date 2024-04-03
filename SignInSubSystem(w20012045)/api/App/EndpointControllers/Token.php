<?php
/**
 * 
 * @author Patrick Shaw
*/

namespace App\EndpointControllers;

class Token extends Endpoint
{
    private $sql = "SELECT u.id, u.password, u.usertypeID, u.genderID, p.interestID
                    FROM users u
                    LEFT JOIN participantinterests p ON u.id = p.userID
                    WHERE u.username = :username";
    private $sqlParams = [];

    public function __construct()
    {
        switch (\App\Request::method()) {
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

                $interestID = $data[0]['interestID'] ?? null;
                error_log("Interest ID: " . $interestID);

                $token = $this->generateJWT($data[0]['id'], $data[0]['usertypeID'], $data[0]['genderID'], $interestID);
                $data = ['token' => $token];
                parent::__construct($data);
                break;

            default:
                throw new \App\ClientError(405);
                break;
        }
    }

    private function generateJWT($id, $usertypeID, $genderID, $interestID)
    {
        $secretKey = SECRET;
        $payload = [
            'sub' => $id,
            'usertypeID' => $usertypeID,
            'genderID' => $genderID,
            'interestID' => $interestID,
            'exp' => strtotime('+1 hour', time()),
            'iat' => time(),
            'iss' => $_SERVER['HTTP_HOST']
        ];
        error_log("Token Payload: " . json_encode($payload));
        $jwt = \FIREBASE\JWT\JWT::encode($payload, $secretKey, 'HS256');
        return $jwt;
    }
}