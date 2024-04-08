<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Author @Harry Wallis

// Connects to database and gets researcherId for query
$dsn = 'sqlite:../db/kv6002_db-3.db'; 
$researcherId = $_GET['researcherId'] ?? '';


// Query to fetch contents for researcher to see who's been invited to project and how many have accepted or declined
try {
    $pdo = new PDO($dsn);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

     $query = "SELECT p.id AS id, p.name as name, p.description as description, s.description AS Status, 
     (SELECT COUNT(*) FROM project ip 
                              LEFT JOIN project_participants pp ON ip.id = pp.projectID 
                              WHERE ip.id = p.id) AS interested,
     (SELECT COUNT(*) FROM project ip 
                              LEFT JOIN project_participants pp ON ip.id = pp.projectID 
                              WHERE ip.id = p.id AND pp.decision = 'accepted') AS accepted,
    (SELECT COUNT(*) FROM project ip 
                              LEFT JOIN project_participants pp ON ip.id = pp.projectID 
                              WHERE ip.id = p.id AND pp.decision = 'declined') AS declined,
     (SELECT COUNT(*) FROM project ip 
                              LEFT JOIN project_participants pp ON ip.id = pp.projectID 
                              WHERE ip.id = p.id AND pp.decision = 'pending') AS pending
               FROM project p
               INNER JOIN status s ON p.statusID = s.id
              WHERE p.owner_userID = :researcherId";

    $stmt = $pdo->prepare($query);
    $stmt->execute(['researcherId' => $researcherId]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($projects);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error. Please contact support.']);
}

?>