<?php
namespace App\EndpointControllers;
require_once __DIR__ . '/../Database.php';

class StudyUpload extends Endpoint {
    private $db;

    public function __construct() {
        parent::__construct();
        $dbName = 'db' . DIRECTORY_SEPARATOR . 'studydb.sqlite';
        $this->db = new \App\Database($dbName);
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
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['success' => "New study record created successfully"]);
        } catch (\PDOException $e) {
            http_response_code(500);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => "Failed to create record: " . $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => "An error occurred: " . $e->getMessage()]);
        }
        exit;
    }

    public function handleRequest() {
        $formData = json_decode(file_get_contents('php://input'), true);
        if ($formData) {
            $this->uploadStudy($formData);
        } else {
            http_response_code(400);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid or missing data']);
            exit;
        }
    }
}

$studyUpload = new StudyUpload();
$studyUpload->handleRequest();