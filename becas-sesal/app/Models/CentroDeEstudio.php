<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CentroDeEstudio extends Model
{
    use HasFactory;
    protected $table = 'centros_de_estudio'; // Correct table name

    protected $fillable = [
        'id_usuario',
        'nombre',
        'direccion',
        'telefono',
        'correo',
        'direccion_ip',
        'agente_usuario',
        'carga_util',
        'ultima_actividad',
    ];
}
