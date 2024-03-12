<?php

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
        $requiredFields = ['username', 'password', 'usertype', 'firstname', 'lastname', 'email'];
        $params = \App\Request::params();
        foreach ($requiredFields as $field) {
            if (!isset($params[$field]) || empty($params[$field])) {
                throw new \App\ClientError(422); // Unprocessable Entity
            }
        }

        $username = $params['username'];
        $password = $params['password'];
        $usertype = $params['usertype'];
        $firstname = $params['firstname'];
        $lastname = $params['lastname'];
        $email = $params['email'];

        if ($usertype !== 'client' && $usertype !== 'participant') {
            throw new \App\ClientError(422); // Unprocessable Entity
        }

        $dbConn = new \App\Database(USERS_DATABASE);

        $sqlParams = [':username' => $username];
        $sql = "SELECT * FROM account WHERE username = :username";
        $existingUser = $dbConn->executeSQL($sql, $sqlParams);
        if (count($existingUser) > 0) {
            throw new \App\ClientError(409); // Conflict, username exists
        }

        $sqlParams = [':email' => $email];
        $sql = "SELECT * FROM account WHERE email = :email";
        $existingEmail = $dbConn->executeSQL($sql, $sqlParams);
        if (count($existingEmail) > 0) {
            throw new \App\ClientError(409); // Conflict, email exists
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO account (username, password, usertype, firstname, lastname, email) 
                VALUES (:username, :password, :usertype, :firstname, :lastname, :email)";
        $sqlParams = [
            ':username' => $username, 
            ':password' => $hashedPassword, 
            ':usertype' => $usertype, 
            ':firstname' => $firstname, 
            ':lastname' => $lastname, 
            ':email' => $email
        ];
        $dbConn->executeSQL($sql, $sqlParams);

        return ['message' => 'Account created successfully'];
    }
}
