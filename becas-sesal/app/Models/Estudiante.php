<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estudiante extends Model
{
    use HasFactory;

    protected $table = 'estudiantes';
    public $timestamps = false;

    protected $fillable = [
        'nombres', 'apellidos', 'identidad', 'carnet', 'correo', 'telefono',
        'direccion', 'estado', 'fecha_de_inicio', 'fecha_de_finalizacion',
        'id_beca', 'centro_de_estudio_id'
    ];

    public function beca()
    {
        return $this->belongsTo(Beca::class, 'id_beca');
    }
    public function monto()
    {
        return $this->belongsTo(Beca::class, 'monto_de_la_beca');
    }
}
