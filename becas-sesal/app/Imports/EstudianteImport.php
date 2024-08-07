<?php

namespace App\Imports;

use App\Models\Estudiante;
use Maatwebsite\Excel\Concerns\ToModel;

use PhpOffice\PhpSpreadsheet\Shared\Date;

class EstudianteImport implements ToModel
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Check if a student with the same 'identidad' value already exists in the database
        $existingStudent = Estudiante::where('identidad', $row[2])->first();

        if ($existingStudent) {
            // If a student with the same 'identidad' value already exists, skip this row
            return null;
        }

        // If no student with the same 'identidad' value exists, insert a new record
        return new Estudiante([
            'nombres' => $row[0],
            'apellidos' => $row[1],
            'identidad' => $row[2],
            'carnet' => $row[3],
            'correo' => $row[4],
            'telefono' => $row[5],
            'direccion' => $row[6],
            'estado' => $row[7],
            'fecha_de_inicio' => Date::excelToDateTimeObject((float)$row[8])->format('Y-m-d'),
            'fecha_de_finalizacion' => Date::excelToDateTimeObject((float)$row[9])->format('Y-m-d'),
            'id_beca' => $row[10],
            'centro_de_estudio_id' => $row[11],
        ]);
    }
}
