<?php

namespace App\Retrospectivas\Models;

use Illuminate\Database\Eloquent\Model;

class RetroItem extends Model
{
    protected $table = 'retro_items';

    protected $fillable = [
        'sprint_id',
        'categoria',
        'descripcion',
        'cumplida',
        'fecha_revision',
    ];

    public function sprint()
    {
        return $this->belongsTo(Sprint::class, 'sprint_id');
    }
}
