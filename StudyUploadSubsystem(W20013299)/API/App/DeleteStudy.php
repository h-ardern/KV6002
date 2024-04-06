<?php

namespace App;

require_once 'Database.php'; // Ensure this path is correct

class DeleteStudy extends Endpoint {
    private $db;

    public function __construct() {
        ob_start(); // Start output buffering to manage any accidental output
        $this->db = new Database('db/studydb.sqlite'); // Adjust the database path as needed
    }

    public function deleteStudy($studyId, $userId) {
        // SQL to verify the study belongs to the user
        $verifySql = "SELECT * FROM Studies WHERE id = :id AND userId = :userId";

        // SQL to delete the study
        $deleteSql = "DELETE FROM Studies WHERE id = :id AND userId = :userId";
        
        try {
            // Verify the study belongs to the user
            $study = $this->db->executeQuery($verifySql, [':id' => $studyId, ':userId' => $userId]);
            if (empty($study)) {
                throw new \Exception("Study not found or access denied.");
            }

            // Proceed with deletion
            $this->db->executeQuery($deleteSql, [':id' => $studyId, ':userId' => $userId]);
            
            ob_end_clean(); // Clean and discard the output buffer
            header('Content-Type: application/json'); // Set the content type to application/json
            echo json_encode(['success' => "Study successfully deleted."]);
        } catch (\PDOException $e) {
            http_response_code(500); // Internal Server Error
            ob_end_clean(); // Clean the buffer also in case of an error
            header('Content-Type: application/json');
            echo json_encode(['error' => "Failed to delete record: " . $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            ob_end_clean(); // Clean the buffer on general exceptions as well
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit; // Terminate the script to prevent any further output
    }

    public function handleRequest() {
        $data = json_decode(file_get_contents('php://input'), true);

        $studyId = $data['studyId'] ?? null;
        $userId = $data['userId'] ?? null; // This should ideally be obtained from session or token to ensure security

        if ($studyId && $userId) {
            $this->deleteStudy($studyId, $userId);
        } else {
            http_response_code(400); // Bad Request
            ob_end_clean(); // Clean the output buffer if exiting early
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid or missing studyId/userId']);
            exit;
        }
    }
}

$deleteStudy = new DeleteStudy();
$deleteStudy->handleRequest();
