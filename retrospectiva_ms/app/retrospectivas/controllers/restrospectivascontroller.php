<?php

require_once __DIR__ . '/../presentation/repositories/RetrospectivasRepository.php';

class RetrospectivasController {

    private $repository;

    public function __construct() {

        $this->repository = new RetrospectivasRepository();

    }

    // GET
    public function index() {

        echo json_encode(
            $this->repository->obtenerTodas()
        );

    }

    // POST
    public function store() {

        $data = json_decode(file_get_contents("php://input"));

        $resultado = $this->repository->crear(
            $data->sprint,
            $data->fecha
        );

        echo json_encode([
            "success" => $resultado
        ]);

    }

}