<?php


namespace App;

class Endpoint {
    private $data;
    protected $allowedParams = ['email', 'password']; 

    public function __construct($data = ["message" => []]) {
        $this->setData($data);
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function getData() {
        return $this->data;
    }

    protected function checkAllowedParams() {
        foreach (\App\Request::params() as $key => $value) {
            if (!in_array($key, $this->allowedParams)) {
                throw new ClientError(422);
            }
        }
    }
}
