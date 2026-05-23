<?php

use Slim\App;
use Slim\Routing\RouteCollectorProxy;
use App\Retrospectivas\Presentation\Repositories\SprintsRepository;
use App\Retrospectivas\Presentation\Repositories\RetroItemsRepository;

return function (App $app) {

    // ── Sprints ──────────────────────────────────────────────
    $app->group('/sprints', function (RouteCollectorProxy $group) {
        $group->get('',        [SprintsRepository::class, 'all']);
        $group->get('/{id}',   [SprintsRepository::class, 'detail']);
        $group->post('',       [SprintsRepository::class, 'create']);
        $group->put('/{id}',   [SprintsRepository::class, 'update']);
        $group->delete('/{id}',[SprintsRepository::class, 'delete']);
    });

    // ── Retro Items ───────────────────────────────────────────
    $app->group('/items', function (RouteCollectorProxy $group) {
        $group->get('',        [RetroItemsRepository::class, 'all']);
        $group->get('/{id}',   [RetroItemsRepository::class, 'detail']);
        $group->post('',       [RetroItemsRepository::class, 'create']);
        $group->put('/{id}',   [RetroItemsRepository::class, 'update']);
        $group->delete('/{id}',[RetroItemsRepository::class, 'delete']);
    });

    // Items filtrados por sprint
    $app->get('/sprints/{sprint_id}/items', [RetroItemsRepository::class, 'porSprint']);
};
