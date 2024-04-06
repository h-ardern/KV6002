<?php


namespace App;

class Database {
    private $dbConnection;

    public function __construct($dbName) {
        $this->setDbConnection($dbName);
    }

    private function setDbConnection($dbName) {
        $this->dbConnection = new \PDO('sqlite:' . $dbName);
        $this->dbConnection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }

    public function executeSQL($sql, $params = []) {
        $stmt = $this->dbConnection->prepare($sql);
        $stmt->execute($params);
        
        if (preg_match('/^(\s*SELECT)/i', $sql)) {
            return $stmt->fetchAll(\PDO::FETCH_ASSOC);
        }
       
        return true;
    }

    public function executeQuery($sql, $params = []) {
        return $this->executeSQL($sql, $params);
    }

    public function query($sql) {
        return $this->dbConnection->query($sql);
    }
}
