<?php

namespace App;

/**
 * Manage database connection
 *
 * This class is used to connect to a database and includes methods for
 * interacting with the database.
 *
 * @author Odera Anakpe
 */
class Database
{
    private $dbConnection;

    public function __construct($dbName)
    {
        $this->setDbConnection($dbName);
    }

    private function setDbConnection($dbName)
    {
        $this->dbConnection = new \PDO('sqlite:' . $dbName);
        $this->dbConnection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    /**
     * @param $sql
     * @param $params
     * @return mixed
     */
    public function executeSQL($sql, $params = [])
    {
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}