<?php

namespace App\Retrospectivas\Controllers;

use App\Retrospectivas\Models\RetroItem;
use Exception;

class RetroItemsController
{
    public function getItems()
    {
        $items = RetroItem::with('sprint')->get();
        return $items->toJson();
    }

    public function getItemsPorSprint($sprintId)
    {
        $items = RetroItem::where('sprint_id', $sprintId)->get();
        return $items->toJson();
    }

    public function getItem($id)
    {
        $item = RetroItem::find($id);
        if (empty($item)) {
            throw new Exception("El item $id no existe", 1);
        }
        return $item;
    }

    public function crearItem($data)
    {
        $item = new RetroItem();
        $item->sprint_id     = $data['sprint_id'];
        $item->categoria     = $data['categoria'];
        $item->descripcion   = $data['descripcion'];
        $item->cumplida      = $data['cumplida'] ?? null;
        $item->fecha_revision = $data['fecha_revision'] ?? null;
        $item->save();
        return $item->toJson();
    }

    public function modificarItem($id, $data)
    {
        $item = $this->getItem($id);
        $item->sprint_id     = $data['sprint_id'] ?? $item->sprint_id;
        $item->categoria     = $data['categoria'] ?? $item->categoria;
        $item->descripcion   = $data['descripcion'] ?? $item->descripcion;
        $item->cumplida      = array_key_exists('cumplida', $data) ? $data['cumplida'] : $item->cumplida;
        $item->fecha_revision = $data['fecha_revision'] ?? $item->fecha_revision;
        $item->save();
        return $item;
    }

    public function borrarItem($id)
    {
        $item = $this->getItem($id);
        $item->delete();
    }
}
