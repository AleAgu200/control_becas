<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Beca;
use App\Models\Estudiante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BecaController extends Controller
{

    public function reporteTrimestales($id_beca, $inicio_inicio, $inicio_fin, $fin_inicio, $fin_fin)
    {
        $estudiantes = Estudiante::where('id_beca', $id_beca)
            ->whereBetween('fecha_de_inicio', [$inicio_inicio, $inicio_fin])
            ->whereBetween('fecha_de_finalizacion', [$fin_inicio, $fin_fin])
            ->get();

        Log::info('reporteTrimestales query:', [
            'id_beca' => $id_beca,
            'inicio_inicio' => $inicio_inicio,
            'inicio_fin' => $inicio_fin,
            'fin_inicio' => $fin_inicio,
            'fin_fin' => $fin_fin,
            'estudiantes' => $estudiantes,
        ]);

        return $estudiantes;
    }
    public function index()
    {
        function returnTodosEstudiantesConBeca($id_beca)
        {
            $estudiantes = Estudiante::where('id_beca', $id_beca)->get();
            $beca = Beca::find($id_beca);
            $estudiantes->each(function ($estudiante) use ($beca) {
                $estudiante->beca = $beca;
            });
            return $estudiantes;
        }
        $resultados =  $this->reporteTrimestales(1, '2023-01-01', '2023-05-31', '2024-01-01', '2024-01-31');
        $becas = Beca::all();
        $estudiantes = Estudiante::all();
        return Inertia::render('Becas', ['becas' => $becas, 'resultados' => $resultados, 'estudiantes' => $estudiantes]);
    }



    public function registrarBeca(Request $request)
    {
        // Validate the request data
        $data = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'monto' => 'required|numeric',
            'estado' => 'required|string|max:255',
        ]);

        // Create a new Beca record
        Beca::create($data);

        // Redirect back to the scholarship list page
        return redirect()->route('becas.index');
    }

    public function allBecas()
    {
        $becas = Beca::all();
        return $becas;
    }
}
