<?php
/**
 * 
 * @author Patrick Shaw
 */
namespace App\EndpointControllers;

class CreateAccount extends Endpoint
{
    public function __construct()
    {
        $data = null; // Initialize $data to capture the response
        switch (\App\Request::method()) {
            case 'POST':
                $data = $this->postAccount();
                break;
            default:
                throw new \App\ClientError(405); // Method Not Allowed
        }

        parent::__construct($data);
    }

    private function postAccount()
    {
        $requiredFields = ['username', 'password', 'usertypeID', 'firstname', 'lastname', 'email', 'address', 'age', 'genderID'];
        $params = \App\Request::params();
        foreach ($requiredFields as $field) {
            if (!isset($params[$field]) || empty($params[$field])) {
                throw new \App\ClientError(422); // Unprocessable Entity
            }
        }

        $username = $params['username'];
        $password = $params['password'];
        $usertypeID = $params['usertypeID'];
        $firstname = $params['firstname'];
        $lastname = $params['lastname'];
        $email = $params['email'];
        $address = $params['address'];
        $age = $params['age'];
        $genderID = $params['genderID'];

        if (!in_array($usertypeID, [1, 2], true)) {
            throw new \App\ClientError(422); // Unprocessable Entity, only 1, or 2 accepted
        }

        if (!in_array($genderID, [1, 2, 3], true)) {
            throw new \App\ClientError(422); // Unprocessable Entity, only 1, 2, or 3 accepted
        }

        if (strlen($username) < 5) {
            throw new \App\ClientError(422); // Unprocessable Entity, username less than 5
        }

        if (strlen($password) < 8 || !preg_match('/\d/', $password) || !preg_match('/[a-zA-Z]/', $password)) {
            throw new \App\ClientError(422); // Unprocessable Entity, password not strong enough
        }

        if (!preg_match('/^[a-zA-Z]+$/', $firstname) || !preg_match('/^[a-zA-Z]+$/', $lastname)) {
            throw new \App\ClientError(422); // Unprocessable Entity, name can only be letters
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \App\ClientError(422); // Unprocessable Entity, incorrect email format
        }

        if ($age < 18 || $age > 120) {
            throw new \App\ClientError(422); // Unprocessable Entity, age must be between 18 and 120
        }

        $dbConn = new \App\Database(USERS_DATABASE);

        $sqlParams = [':username' => $username];
        $sql = "SELECT * FROM users WHERE username = :username";
        $existingUser = $dbConn->executeSQL($sql, $sqlParams);
        if (count($existingUser) > 0) {
            throw new \App\ClientError(409); // Conflict, username exists
        }

        $sqlParams = [':email' => $email];
        $sql = "SELECT * FROM users WHERE email = :email";
        $existingEmail = $dbConn->executeSQL($sql, $sqlParams);
        if (count($existingEmail) > 0) {
            throw new \App\ClientError(409); // Conflict, email exists
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO users (username, password, usertypeID, firstname, lastname, email, address, age, genderID) 
                VALUES (:username, :password, :usertypeID, :firstname, :lastname, :email, :address, :age, :genderID)";
        $sqlParams = [
            ':username' => $username,
            ':password' => $hashedPassword,
            ':usertypeID' => $usertypeID,
            ':firstname' => $firstname,
            ':lastname' => $lastname,
            ':email' => $email,
            ':address' => $address,
            ':age' => $age,
            ':genderID' => $genderID
        ];
        $dbConn->executeSQL($sql, $sqlParams);

        return ['message' => 'Account created successfully'];
    }
}