<?php

namespace App;

require_once 'Database.php'; // Ensure this path is correct

class GetStudies extends Endpoint {
    private $db;

    public function __construct() {
        ob_start(); // Start output buffering
        $this->db = new Database('db/studydb.sqlite'); // Adjust the database path as needed
    }

    public function fetchAllStudies() {
        $sql = "SELECT * FROM Studies";
    
        try {
            $studies = $this->db->executeQuery($sql);
            ob_end_clean(); // Clean (and discard) the output buffer
            header('Content-Type: application/json'); // Set the content type to application/json
            echo json_encode($studies);
        } catch (Exception $e) {
            http_response_code(500); // HTTP 500 Internal Server Error
            ob_end_clean(); // Ensure the buffer is cleaned in case of an error as well
            header('Content-Type: application/json'); // Set the content type to application/json
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit; // Terminate the script to prevent any further output
    }

    public function handleRequest() {
        $this->fetchAllStudies();
    }
}

$getStudies = new GetStudies();
$getStudies->handleRequest();
