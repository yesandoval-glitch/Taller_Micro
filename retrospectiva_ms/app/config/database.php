<?php

class Database {

    private $host = "localhost";
    private $db_name = "retrospectivas_db";
    private $username = "";
    private $password = "BASES202610";

    public function connect() {

        try {

            $conn = new PDO(
                "mysql:host=".$this->host.";dbname=".$this->db_name,
                $this->username,
                $this->password
            );

            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            return $conn;

        } catch(PDOException $e) {

            die("Error de conexión: " . $e->getMessage());

        }

    }
}