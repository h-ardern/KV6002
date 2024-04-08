<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');


header('Content-Type: application/json');

// Author @Harry Wallis

//Connect to database and change data in database for: projectId, userId and decision 
$dsn = 'sqlite:../db/kv6002_db-3.db'; 
$data = json_decode(file_get_contents('php://input'), true);

$projectId = $data['projectId'];
$userId = $data['userId'];
$decision = $data['decision'];

try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare('UPDATE project_participants SET decision = :decision 
                           WHERE projectID = :projectId AND userID = :userId AND roleID = 1');
    $stmt->execute(['decision' => $decision, 'projectId' => $projectId, 'userId' => $userId]);

    if ($stmt->rowCount()) {
        // If row count is greater than 0, it means the update was successful.
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No updates performed.']);
    }
} catch (PDOException $e) {
    // Send a server error HTTP status code.
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
