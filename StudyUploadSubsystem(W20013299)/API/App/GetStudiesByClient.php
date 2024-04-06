<?php

namespace App;

require_once 'Database.php'; 

class GetStudiesByClient extends Endpoint {
    private $db;

    public function __construct() {
        ob_start(); 
        $this->db = new Database('db/studydb.sqlite'); 
    }

    
    public function fetchStudiesByUser() {
       
        $userId = $_GET['userId'] ?? null; 

        if (!$userId) {
            http_response_code(400); 
            echo json_encode(['error' => 'Invalid or missing userId']);
            return; 
        }

        $sql = "SELECT * FROM Studies WHERE userId = :userId";
    
        try {
            $studies = $this->db->executeQuery($sql, [':userId' => $userId]);
            ob_end_clean(); 
            header('Content-Type: application/json'); 
            echo json_encode($studies);
        } catch (\Exception $e) { 
            http_response_code(500); 
            ob_end_clean(); 
            header('Content-Type: application/json'); 
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit; 
    }

   
    public function handleRequest() {
        $this->fetchStudiesByUser();
    }
}


$getStudiesByClient = new GetStudiesByClient();
$getStudiesByClient->handleRequest();

