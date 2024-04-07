<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

//Author @Harry Wallis

// Connect to database and get userId for query
$dsn = 'sqlite:../db/kv6002_db-3.db'; 
$userID = $_GET['userId'];

// Query to find projects that have been offered to participants
try {
    $pdo = new PDO($dsn);
    $stmt = $pdo->prepare('SELECT p.id, p.name, p.description, pp.decision FROM project p 
                           JOIN project_participants pp ON p.id = pp.projectID 
                           WHERE pp.userID = :userID AND pp.roleID = 1');
    $stmt->execute(['userID' => $userID]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($projects);
} catch (PDOException $e) {
    // Send HTTP status code 500 for server error
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
