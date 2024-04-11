<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Beca extends Model
{
    use HasFactory;

    protected $table = 'becas';

    protected $fillable = [
        'tipo_de_beca',
        'duracion',
        'monto_de_la_beca',
        'codigo_planilla',
    ];

    public function centroDeEstudio()
    {
        return $this->belongsTo('App\Models\CentroDeEstudio', 'centro_de_estudio_id');
    }
    public function getTipoDeBecaAttribute($value)
    {
        return $this->attributes['tipo_de_beca'];
    }
    public function getMontoDeLaBecaAttribute($value)
    {
        return $this->attributes['monto_de_la_beca'];
    }
    public function returnTodosEstudiantesConBeca($id_beca)
    {
        $estudiantes = Estudiante::where('id_beca', $id_beca)->with('beca')->get();
        return $estudiantes;
    }
    public function returnMonthlyReport($id_beca, $fecha1, $fecha2)
    {
        $estudiantes = Estudiante::where('id_beca', $id_beca)->with('beca')->get();
        $reporte = [];
        foreach ($estudiantes as $estudiante) {
        }
        return $reporte;
    }

    public function estudiantes()
    {
        return $this->hasMany(Estudiante::class, 'id_beca');
    }
}
