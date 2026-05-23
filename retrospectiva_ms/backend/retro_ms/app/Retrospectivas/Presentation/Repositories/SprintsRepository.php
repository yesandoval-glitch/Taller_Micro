<?php

namespace App\Retrospectivas\Presentation\Repositories;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Retrospectivas\Controllers\SprintsController;
use Exception;

class SprintsRepository
{
    public function all(Request $request, Response $response): Response
    {
        $controller = new SprintsController();
        $sprints    = $controller->getSprints();
        $response->getBody()->write($sprints);
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function detail(Request $req, Response $resp, $args): Response
    {
        try {
            $id         = $args['id'];
            $controller = new SprintsController();
            $sprint     = $controller->getSprint($id);
            $resp->getBody()->write($sprint->toJson());
            return $resp->withHeader('Content-Type', 'application/json');
        } catch (Exception $ex) {
            $resp->getBody()->write(json_encode(['error' => $ex->getMessage()]));
            $code = ($ex->getCode() == 1) ? 404 : 400;
            return $resp->withStatus($code)->withHeader('Content-Type', 'application/json');
        }
    }

    public function create(Request $request, Response $response): Response
    {
        $data       = json_decode($request->getBody()->getContents(), true);
        $controller = new SprintsController();
        $sprint     = $controller->crearSprint($data);
        $response->getBody()->write($sprint);
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $req, Response $resp, $args): Response
    {
        try {
            $id         = $args['id'];
            $data       = json_decode($req->getBody()->getContents(), true);
            $controller = new SprintsController();
            $sprint     = $controller->modificarSprint($id, $data);
            $resp->getBody()->write($sprint->toJson());
            return $resp->withStatus(200)->withHeader('Content-Type', 'application/json');
        } catch (Exception $ex) {
            $resp->getBody()->write(json_encode(['error' => $ex->getMessage()]));
            $code = ($ex->getCode() == 1) ? 404 : 400;
            return $resp->withStatus($code)->withHeader('Content-Type', 'application/json');
        }
    }

    public function delete(Request $req, Response $resp, $args): Response
    {
        try {
            $id         = $args['id'];
            $controller = new SprintsController();
            $controller->borrarSprint($id);
            $resp->getBody()->write(json_encode(['msg' => 'Sprint eliminado']));
            return $resp->withStatus(200)->withHeader('Content-Type', 'application/json');
        } catch (Exception $ex) {
            $resp->getBody()->write(json_encode(['error' => $ex->getMessage()]));
            $code = ($ex->getCode() == 1) ? 404 : 400;
            return $resp->withStatus($code)->withHeader('Content-Type', 'application/json');
        }
    }
}
