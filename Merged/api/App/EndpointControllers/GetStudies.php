<?php
namespace App\EndpointControllers;
require_once __DIR__ . '/../Database.php';

class GetStudies extends Endpoint {
    private $db;

    public function __construct() {
        parent::__construct();
        ob_start();
        $this->db = new \App\Database('db/studydb.sqlite');
    }

    public function fetchAllStudies() {
        $sql = "SELECT * FROM Studies";
        try {
            $studies = $this->db->executeSQL($sql);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode($studies);
        } catch (Exception $e) {
            http_response_code(500);
            ob_end_clean();
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
        }
        exit;
    }

    public function handleRequest() {
        $this->fetchAllStudies();
    }
}

$getStudies = new GetStudies();
$getStudies->handleRequest();