<?php

namespace App\Retrospectivas\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $table = 'sprints';

    protected $fillable = ['nombre', 'fecha_inicio', 'fecha_fin'];

    public function items()
    {
        return $this->hasMany(RetroItem::class, 'sprint_id');
    }
}
