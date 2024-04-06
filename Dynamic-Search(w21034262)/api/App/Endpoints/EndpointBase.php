<?php

namespace App\Endpoints;
/**
 * The base class for API endpoints, contains common functionality.
 *
 * @author Odera Anakpe
 */
class EndpointBase
{
    /**
     * @var array $data The data associated with the endpoint.
     */
    private $data;
    /**
     * @var array $allowedParams Set a default as an empty array. This can be
     * overridden in the child class when needed.
     */
    protected $allowedParams = [];

    /** @param array $data The initial data for the endpoint. */
    public function __construct($data = ["message" => []])
    {
        $this->setData($data);
    }

    public function setData($data)
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }

    /**
     * Checks if the requested parameters are allowed.
     *
     * This method can be called in the child class. If
     * the allowedParams property is defined in the child,
     * it will use those. Otherwise, it will use the default
     * set in this class.
     *
     * @throws App\ClientError If an invalid parameter is detected (HTTP 422).
     */
    protected function checkAllowedParams()
    {
        foreach (\App\Request::params() as $key => $value) {
            if (!in_array($key, $this->allowedParams)) {
                throw new \App\ClientError(422,"request does not support '$key' parameter");
            }
        }
    }
    protected function getContentAuthors($contentId, $dbConn)
    {
        $stmt = "SELECT name AS author_name, author.id AS author_id, country, city, institution
                 FROM affiliation
                 JOIN author ON author.id = affiliation.author
                 WHERE content = :contentId
                 ";
        $params['contentId'] = $contentId;
        return $dbConn->executeSQL($stmt, $params);
    }

    /**
     * get list of awards related to a particular content
     *
     * @param $contentId
     * @param $dbConn
     * @return mixed
     */
    protected function getContentAwards($contentId, $dbConn)
    {
        $stmt = "SELECT award.name
                 FROM content
                 JOIN content_has_award ON content.id = content_has_award.content
                 JOIN award ON content_has_award.award = award.id   
                 WHERE content.id = :contentId
                 ";
        $params['contentId'] = $contentId;
        return $dbConn->executeSQL($stmt, $params);
    }
}