<?php

namespace App\Retrospectivas\Presentation\Repositories;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Retrospectivas\Controllers\RetroItemsController;
use Exception;

class RetroItemsRepository
{
    public function all(Request $request, Response $response): Response
    {
        $controller = new RetroItemsController();
        $items      = $controller->getItems();
        $response->getBody()->write($items);
        return $response->withHeader('Content-Type', 'application/json');
    }

    public function porSprint(Request $req, Response $resp, $args): Response
    {
        $sprintId   = $args['sprint_id'];
        $controller = new RetroItemsController();
        $items      = $controller->getItemsPorSprint($sprintId);
        $resp->getBody()->write($items);
        return $resp->withHeader('Content-Type', 'application/json');
    }

    public function detail(Request $req, Response $resp, $args): Response
    {
        try {
            $id         = $args['id'];
            $controller = new RetroItemsController();
            $item       = $controller->getItem($id);
            $resp->getBody()->write($item->toJson());
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
        $controller = new RetroItemsController();
        $item       = $controller->crearItem($data);
        $response->getBody()->write($item);
        return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
    }

    public function update(Request $req, Response $resp, $args): Response
    {
        try {
            $id         = $args['id'];
            $data       = json_decode($req->getBody()->getContents(), true);
            $controller = new RetroItemsController();
            $item       = $controller->modificarItem($id, $data);
            $resp->getBody()->write($item->toJson());
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
            $controller = new RetroItemsController();
            $controller->borrarItem($id);
            $resp->getBody()->write(json_encode(['msg' => 'Item eliminado']));
            return $resp->withStatus(200)->withHeader('Content-Type', 'application/json');
        } catch (Exception $ex) {
            $resp->getBody()->write(json_encode(['error' => $ex->getMessage()]));
            $code = ($ex->getCode() == 1) ? 404 : 400;
            return $resp->withStatus($code)->withHeader('Content-Type', 'application/json');
        }
    }
}
