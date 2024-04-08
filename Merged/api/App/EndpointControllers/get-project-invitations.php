<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Author @Harry Wallis

// Connect to database and get projectId for query
$dsn = 'sqlite:../db/kv6002_db-3.db'; 
$projectId = $_GET['projectId']; 

// Query to get participants names and their decisions
try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "SELECT u.firstName, u.lastName, pp.decision 
              FROM users u
              JOIN project_participants pp ON u.id = pp.userID
              WHERE pp.projectID = :projectId";

    $stmt = $pdo->prepare($query);
    $stmt->execute(['projectId' => $projectId]);
    $invitations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($invitations);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>