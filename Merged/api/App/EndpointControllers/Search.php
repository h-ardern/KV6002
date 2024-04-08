<?php /** @noinspection ALL */

namespace App\EndpointControllers;

/**
 *
 * @author Odera Anakpe
 */

use \App\Request as Request;

class Search extends Endpoint
{
    protected $allowedParams = ["university", "search_term", "status", "interest"];
    private $sql = "SELECT project.id As project_id, project.name As project_name, requirements,
                    project.description As project_desc, status.description As status, 
                    institution.name As institution_name
                    FROM project
                    JOIN status on project.statusID = status.id
                    JOIN institution on project.institutionID = institution.id";
    private $sqlParams = [];

    public function __construct()
    {
        switch (\App\Request::method()) {
            case 'GET':
                $this->checkAllowedParams();
                $this->buildSQL();
                $dbConn = new \App\Database(\App\Constants::DB_NAME);
                $data = $dbConn->executeSQL($this->sql, $this->sqlParams);
                $data = $this->AddContributors($data, $dbConn);
                parent::__construct($data);
                break;
            default:
                throw new \App\ClientError(405);
        }
    }

    private function buildSQL()
    {
        if ((isset(Request::params()['content']) && (isset(Request::params()['country']) || isset(Request::params()['author'])))
            || ((isset(Request::params()['country']) && (isset(Request::params()['content']) || isset(Request::params()['author']))))
            || ((isset(Request::params()['author']) && (isset(Request::params()['contry']) || isset(Request::params()['content']))))
        ) {
            throw new \App\ClientError(422, "cannot use more than one supported param at the same time");
        }
        if (isset(Request::params()['content'])) {
            if (!is_numeric(Request::params()['content']))
                throw new \App\ClientError(422, "expected numeric value for content");

            $this->sql .= " WHERE content = :content";
            $this->sqlParams[":content"] = Request::params()['content'];
        }
        if (isset(Request::params()['country'])) {

            $this->sql .= " WHERE country LIKE :country";
            $this->sqlParams[":country"] = Request::params()['country'];
        }
        if (isset(Request::params()['author'])) {
            $this->sql .= " WHERE author = :author";
            $this->sqlParams[":author"] = Request::params()['author'];
        }
    }
    private function AddContributors($data, $dbConn)
    {
        foreach ($data as $key => $item) {
            $data[$key]['contributors']= $this->GetContributors($data[$key]['project_id'],$dbConn);
        }
    return $data;
    }
    private function GetContributors($project_id, $dbConn){
        $sql = "SELECT firstname As first_name, lastname As last_name, users.email As email,
                Age As age, role.description As role
                FROM project_participants
                JOIN users on project_participants.userID = users.id
                JOIN role on project_participants.roleID = role.id
                WHERE project_participants.projectID = :project_id
               ";
        $sqlParams[":project_id"] = $project_id;
        $data = $dbConn->executeSQL($sql,$sqlParams);
        return $data;
    }
}