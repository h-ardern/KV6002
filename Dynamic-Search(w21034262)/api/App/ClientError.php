<?php

namespace App;
/**
 * An exception class for client-related errors.
 *
 * Extends the base Exception class and provides specific error responses
 * based on the inputted error codes.
 *
 * @author Odera Anakpe
 */
class ClientError extends \Exception
{
    /** @param int $code The error code. */
    public function __construct($code, $additionalInfo = null)
    {
        http_response_code($code);
        parent::__construct($this->errorResponses($code, $additionalInfo));
    }

    /**
     * @param int $code The error code.
     *
     * @return string The error message corresponding to the error code.
     * @throws \Exception If the error code is not handled in the switch statement.
     */
    public function errorResponses($code, $additionalInfo = null)
    {
        switch ($code) {
            case 400:
                $message = "Bad Request";
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                break;
            case 401:
                $message = "Unauthorised";
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                break;
            case 404:
                $message = 'Endpoint Not Found';
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                break;
            case 405:
                $message = 'Method Not Allowed';
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                break;
            case 422:
                $message = 'Unprocessable Entity';
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                break;
            default:
                $message = 'Internal Server Error';
                if (!is_null($additionalInfo))
                    $message .= " - " . $additionalInfo;
                throw new \Exception($message);
        }
        return $message;
    }
}