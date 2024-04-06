<?php

namespace App;

require_once 'Database.php'; 

class StudyUpload {
    private $db;

    public function __construct() {
        
        $dbName = 'db' . DIRECTORY_SEPARATOR . 'studydb.sqlite';
        $this->db = new Database($dbName);
    }

    public function uploadStudy($formData) {
        
        $sql = "INSERT INTO Studies (name, description, objectives, methodology, participantRequirements, institution, researcherName, researchArea, compensation, startDate, endDate, applicationDeadline, userId) VALUES (:name, :description, :objectives, :methodology, :participantRequirements, :institution, :researcherName, :researchArea, :compensation, :startDate, :endDate, :applicationDeadline, :userId)";

        try {
            
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
                ':userId' => $formData['userId']
            ]);
            echo "New study record created successfully";
        } catch (\PDOException $e) {
            
            http_response_code(500); 
            echo json_encode(['error' => "Failed to create record: " . $e->getMessage()]);
        } catch (\Exception $e) {
            
            http_response_code(500); 
            echo json_encode(['error' => "An error occurred: " . $e->getMessage()]);
        }
    }

    public function handleRequest() {
        // Read JSON input
        $formData = json_decode(file_get_contents('php://input'), true);

        if ($formData) {
            $this->uploadStudy($formData);
        } else {
            http_response_code(400); 
            echo json_encode(['error' => 'Invalid or missing data']);
        }
    }
}


$studyUpload = new StudyUpload();
$studyUpload->handleRequest();
