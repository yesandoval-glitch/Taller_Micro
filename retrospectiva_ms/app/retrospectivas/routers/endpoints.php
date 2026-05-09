<?php

require_once __DIR__ . '/../controllers/RetrospectivasController.php';

header("Content-Type: application/json");

$controller = new RetrospectivasController();

$method = $_SERVER['REQUEST_METHOD'];

$request = $_SERVER['REQUEST_URI'];


// GET
if ($request == '/api/retrospectivas' && $method == 'GET') {

    $controller->index();

}

// POST
if ($request == '/api/retrospectivas' && $method == 'POST') {

    $controller->store();

}