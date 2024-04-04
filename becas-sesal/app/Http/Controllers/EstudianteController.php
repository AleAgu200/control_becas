<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EstudianteController extends Controller
{
    public function index()
    {
        $becarios = Estudiante::with('beca')->get()->map(function ($estudiante) {
            $estudiante['tipo_de_beca'] = $estudiante->beca->tipo_de_beca;
            $estudiante['monto_de_la_beca'] = $estudiante->beca->monto_de_la_beca;
            return $estudiante;
        });
        return Inertia::render('Beneficiarios', ['becarios' => $becarios]);
    }


    public function registrarEstudiante(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'nombres' => 'required|string|max:255',
            'identidad' => 'required|string|max:13|unique:estudiantes|regex:/^[0-9]{4}-[0-9]{4}-[0-9]{5}$/',
            'apellidos' => 'required|string|max:255',
            'carnet' => 'nullable|string|max:255',
            'correo' => 'required|string|email|max:255',
            'telefono' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'tipo de estudio (grado, posgrado o diplomado)' => 'required|string|max:255',
            'semestre' => 'required|string|max:255',
            'estado' => 'required|string|max:255',
            'id_beca' => 'required|exists:becas,id',
            'centro_de_estudio_id' => 'required|exists:centros_de_estudio,id',
        ]);

        // Create a new Estudiante record
        Estudiante::create($data);

        // Redirect back to the student list page
        return redirect()->route('estudiantes.index');
    }
}
