<?php

// Author @Harry Wallis
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

//Connect with database
$dsn = 'sqlite:../db/kv6002_db-3.db'; 
$projectId = $_GET['projectId'] ?? '';

// Query to fetch the names and status of their invitations 

try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

     $query = "SELECT u.id, u.firstname  || ' ' || u.lastname participantName, pp.decision
                FROM project p
                LEFT JOIN project_participants pp ON p.id = pp.projectID
                LEFT JOIN users u ON pp.userID = u.id
                WHERE p.id = :projectId";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['projectId' => $projectId]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($projects);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error. Please contact support.']);
}

?>