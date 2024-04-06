<?php
/**
 * General exception handler.
 *
 * Handles uncaught exceptions by encoding details as JSON and exiting.
 *
 * @param Exception $e The exception object to be handled.
 *
 * @return void
 *
 * @author Odera Anakpe
 */
function exceptionHandler($e)
{
    http_response_code(500);
    $output['message'] = "Internal Server Error";
    $output['details']['exception'] = $e->getMessage();
    $output['details']['file'] = $e->getFile();
    $output['details']['line'] = $e->getLine();
    echo json_encode($output);
    exit();
}