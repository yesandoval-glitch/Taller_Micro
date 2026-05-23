<?php

namespace App\Retrospectivas\Controllers;

use App\Retrospectivas\Models\Sprint;
use Exception;

class SprintsController
{
    public function getSprints()
    {
        $sprints = Sprint::with('items')->get();
        return $sprints->toJson();
    }

    public function getSprint($id)
    {
        $sprint = Sprint::with('items')->find($id);
        if (empty($sprint)) {
            throw new Exception("El sprint $id no existe", 1);
        }
        return $sprint;
    }

    public function crearSprint($data)
    {
        $sprint = new Sprint();
        $sprint->nombre      = $data['nombre'];
        $sprint->fecha_inicio = $data['fecha_inicio'];
        $sprint->fecha_fin   = $data['fecha_fin'];
        $sprint->save();
        return $sprint->toJson();
    }

    public function modificarSprint($id, $data)
    {
        $sprint = $this->getSprint($id);
        $sprint->nombre      = $data['nombre'];
        $sprint->fecha_inicio = $data['fecha_inicio'];
        $sprint->fecha_fin   = $data['fecha_fin'];
        $sprint->save();
        return $sprint;
    }

    public function borrarSprint($id)
    {
        $sprint = $this->getSprint($id);
        $sprint->delete();
    }
}
