<?php

namespace App\Imports;

use App\Models\Estudiante;
use Maatwebsite\Excel\Concerns\ToModel;

class EstudianteImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        return new Estudiante([
            'nombres' => $row[0],
            'apellidos' => $row[1],
            'identidad' => $row[2],
            'carnet' => $row[3],
            'correo' => $row[4],
            'telefono' => $row[5],
            'direccion' => $row[6],
            'estado' => $row[7],
            'fecha_de_inicio' => $row[8],
            'fecha_de_finalizacion' => $row[9],
            'id_beca' => $row[10],
            'centro_de_estudio_id' => $row[11],
        ]);
    }
}
