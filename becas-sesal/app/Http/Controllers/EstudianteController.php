<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Imports\EstudianteImport;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EstudianteController extends Controller
{
    public function index()
    {
        $becarios = Estudiante::with('beca')->get()->map(function ($estudiante) {
            if ($estudiante->beca !== null) {
                $estudiante['tipo_de_beca'] = $estudiante->beca->tipo_de_beca;
                $estudiante['monto_de_la_beca'] = $estudiante->beca->monto_de_la_beca;
            } else {
                // Handle the case where $estudiante->beca is null
                $estudiante['tipo_de_beca'] = 'N/A';
                $estudiante['monto_de_la_beca'] = 'N/A';
            }
            return $estudiante;
        });
        return Inertia::render('Beneficiarios', ['becarios' => $becarios]);
    }


    public function registrarEstudiante(Request $request)
    {

        $data = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'identidad' => 'required|string|max:13|unique:estudiantes,identidad|regex:/^[0-9]{4}[0-9]{4}[0-9]{5}$/',
            'carnet' => 'nullable|string|max:255',
            'correo' => 'required|string|email|max:255',
            'telefono' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'estado' => 'required|numeric|max:1',
            'id_beca' => 'required|exists:becas,id',
            'centro_de_estudio_id' => 'required|numeric',
            'fecha_de_inicio' => 'required|date',
            'fecha_de_finalizacion' => 'required|date',

        ]);

        // Create a new Estudiante record
        try {
            $estudiante = Estudiante::create($data);
            Log::info('Estudiante registrado correctamente');
        } catch (\Exception $e) {
            Log::error('Error al registrar el estudiante: ' . $e->getMessage());
            return redirect()->back()->withErrors('Error al registrar el estudiante');
        }

        // Redirect back to the student list page
        return redirect()->route('beneficiarios');
    }

    public function getStudent(Request $request)
    {
        $data = $request->validate([
            'identidad' => 'required|string|max:13|regex:/^[0-9]{4}[0-9]{4}[0-9]{5}$/',
        ]);

        $estudiante = Estudiante::where('identidad', $data['identidad'])->with('beca')->first();
        if ($estudiante) {
            return Inertia::render('Beneficiario', [
                'estudiante' => $estudiante
            ]);
        } else {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }
    }

    public function import()
    {

        Excel::import(new EstudianteImport, request()->file('file'));
        return redirect()->route('beneficiarios');
    }

    public function updateEstudiante($identidad)
    {
        // Check if the student exists
        $estudiante = Estudiante::where('identidad', $identidad)->first();
        if (!$estudiante) {
            return response()->json(['error' => 'Estudiante no encontrado'], 404);
        }

        $data = request()->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'identidad' => 'required|string|max:13|regex:/^[0-9]{4}[0-9]{4}[0-9]{5}$/',
            'carnet' => 'nullable|string|max:255',
            'correo' => 'required|string|email|max:255',
            'telefono' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'estado' => 'required|numeric|max:1',
            'id_beca' => 'required|exists:becas,id',
            'centro_de_estudio_id' => 'required|numeric',
            'fecha_de_inicio' => 'required|date',
            'fecha_de_finalizacion' => 'required|date',
        ]);

        $estudiante->update($data);

        // Return the updated student
        return response()->json($estudiante, 200);
    }
}
