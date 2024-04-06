<?php

namespace App;

require_once 'Database.php'; // Ensure this path is correct

class GetStudiesByClient extends Endpoint {
    private $db;

    public function __construct() {
        ob_start(); // Start output buffering
        $this->db = new Database('db/studydb.sqlite'); // Adjust the database path as needed
    }

    // Renamed to closely match the example, but it still fetches studies by user
    public function fetchStudiesByUser() {
        // Assuming $userId is obtained securely, for example, from session or validated GET/POST data
        $userId = $_GET['userId'] ?? null; // PHP 7.0+ null coalescing operator

        if (!$userId) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Invalid or missing userId']);
            return; // Exit the method early if no userId
        }

        $sql = "SELECT * FROM Studies WHERE userId = :userId";
    
        try {
            $studies = $this->db->executeQuery($sql, [':userId' => $userId]);
            ob_end_clean(); // Clean (and discard) the output buffer
            header('Content-Type: application/json'); // Set the content type to application/json
            echo json_encode($studies);
        } catch (\Exception $e) { // Make sure to include the global namespace with '\Exception'
            http_response_code(500); // HTTP 500 Internal Server Error
            ob_end_clean(); // Ensure the buffer is cleaned in case of an error as well
            header('Content-Type: application/json'); // Set the content type to application/json
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit; // Terminate the script to prevent any further output
    }

    // Adjusted to match the structure of the provided example
    public function handleRequest() {
        $this->fetchStudiesByUser();
    }
}

// Adjusted to match the class name
$getStudiesByClient = new GetStudiesByClient();
$getStudiesByClient->handleRequest();

