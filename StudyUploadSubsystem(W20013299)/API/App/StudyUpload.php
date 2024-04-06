<?php

namespace App;

require_once 'Database.php'; // Adjust the path as needed

class StudyUpload {
    private $db;

    public function __construct() {
        // Use DIRECTORY_SEPARATOR for compatibility across Windows/Unix-like systems
        $dbName = 'db' . DIRECTORY_SEPARATOR . 'studydb.sqlite';
        $this->db = new Database($dbName);
    }

    public function uploadStudy($formData) {
        // Assuming userId is sent as part of the formData
        $sql = "INSERT INTO Studies (name, description, objectives, methodology, participantRequirements, institution, researcherName, researchArea, compensation, startDate, endDate, applicationDeadline, userId) VALUES (:name, :description, :objectives, :methodology, :participantRequirements, :institution, :researcherName, :researchArea, :compensation, :startDate, :endDate, :applicationDeadline, :userId)";

        try {
            // Bind parameters, including userId, to prevent SQL injection
            $this->db->executeSQL($sql, [
                ':name' => $formData['name'],
                ':description' => $formData['description'],
                ':objectives' => $formData['objectives'],
                ':methodology' => $formData['methodology'],
                ':participantRequirements' => $formData['participantRequirements'],
                ':institution' => $formData['institution'],
                ':researcherName' => $formData['researcherName'],
                ':researchArea' => $formData['researchArea'],
                ':compensation' => $formData['compensation'],
                ':startDate' => $formData['startDate'],
                ':endDate' => $formData['endDate'],
                ':applicationDeadline' => $formData['applicationDeadline'],
                ':userId' => $formData['userId'] // Ensure 'userId' is included in formData on the frontend
            ]);
            echo "New study record created successfully";
        } catch (\PDOException $e) {
            // Handle SQL errors or connection issues
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => "Failed to create record: " . $e->getMessage()]);
        } catch (\Exception $e) {
            // Handle all other exceptions
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => "An error occurred: " . $e->getMessage()]);
        }
    }

    public function handleRequest() {
        // Read JSON input
        $formData = json_decode(file_get_contents('php://input'), true);

        if ($formData) {
            $this->uploadStudy($formData);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Invalid or missing data']);
        }
    }
}

// Create an instance and handle the request
$studyUpload = new StudyUpload();
$studyUpload->handleRequest();
