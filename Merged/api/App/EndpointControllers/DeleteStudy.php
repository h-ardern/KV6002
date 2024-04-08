<?php
namespace App\EndpointControllers;
require_once __DIR__ . '/../Database.php';

class DeleteStudy extends Endpoint {
    private $db;

    public function __construct() {
        parent::__construct();
        ob_start();
        $this->db = new \App\Database('db/studydb.sqlite');
    }

    public function deleteStudy($studyId, $userId) {
        $verifySql = "SELECT * FROM Studies WHERE id = :id AND userId = :userId";
        $deleteSql = "DELETE FROM Studies WHERE id = :id AND userId = :userId";
        try {
            $study = $this->db->executeSQL($verifySql, [':id' => $studyId, ':userId' => $userId]);
            if (empty($study)) {
                throw new \Exception("Study not found or access denied.");
            }
            $this->db->executeSQL($deleteSql, [':id' => $studyId, ':userId' => $userId]);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['success' => "Study successfully deleted."]);
        } catch (\PDOException $e) {
            http_response_code(500);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => "Failed to delete record: " . $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit;
    }

    public function handleRequest() {
        $data = json_decode(file_get_contents('php://input'), true);
        $studyId = $data['studyId'] ?? null;
        $userId = $data['userId'] ?? null;
        if ($studyId && $userId) {
            $this->deleteStudy($studyId, $userId);
        } else {
            http_response_code(400);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid or missing studyId/userId']);
            exit;
        }
    }
}

$deleteStudy = new DeleteStudy();
$deleteStudy->handleRequest();