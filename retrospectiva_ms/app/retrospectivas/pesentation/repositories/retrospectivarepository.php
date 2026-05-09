<?php

require_once __DIR__ . '/../../../config/database.php';

class RetrospectivasRepository {

    private $conn;

    public function __construct() {

        $database = new Database();
        $this->conn = $database->connect();

    }

    // OBTENER TODAS
    public function obtenerTodas() {

        $sql = "SELECT * FROM retrospectivas";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);

    }

    // CREAR
    public function crear($sprint, $fecha) {

        $sql = "INSERT INTO retrospectivas (sprint, fecha)
                VALUES (:sprint, :fecha)";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ':sprint' => $sprint,
            ':fecha' => $fecha
        ]);
    }

}