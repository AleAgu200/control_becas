<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CentroDeEstudio; // Import the model
use Inertia\Inertia; // Import Inertia
use Illuminate\Support\Facades\Log;


class CentroDeEstudioController extends Controller
{
    public function index()
    {
        // Fetch all centers of study
        $centros = CentroDeEstudio::all();

        // Return the Inertia view with the list of centros
        return Inertia::render('Centros', [
            'centros' => $centros
        ]);
    }

    public function registrarCentro(Request $request)
    {
        $data = $request->validate([
            'id_usuario' => 'required|numeric',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:255',
            'correo' => 'required|string|email|max:255',
            'direccion_ip' => 'required|string|max:255',
            'agente_usuario' => 'required|string|max:255',
            'carga_util' => 'required|string|max:255',
            'ultima_actividad' => 'required|date',
        ]);

        // Create a new CentroDeEstudio record
        try {
            $centro = CentroDeEstudio::create($data);
            Log::info('Centro de estudio registrado correctamente');
        } catch (\Exception $e) {
            Log::error('Error al registrar el centro de estudio: ' . $e->getMessage());
            return redirect()->back()->withErrors('Error al registrar el centro de estudio');
        }

        // Redirect back to the center list page
        return redirect()->route('centros');
    }

    public function getCentro(Request $request)
    {
        $data = $request->validate([
            'id' => 'required|numeric',
        ]);

        $centro = CentroDeEstudio::where('id', $data['id'])->first();
        if ($centro) {
            return Inertia::render('Centro', [
                'centro' => $centro
            ]);
        } else {
            return response()->json(['error' => 'Centro de estudio no encontrado'], 404);
        }
    }

    public function import()
    {
        Excel::import(new CentroDeEstudioImport, request()->file('file'));
        return redirect()->route('centros');
    }

    public function updateCentro($id)
    {
        // Check if the center exists
        $centro = CentroDeEstudio::where('id', $id)->first();
        if (!$centro) {
            return response()->json(['error' => 'Centro de estudio no encontrado'], 404);
        }

        $data = request()->validate([
            'id_usuario' => 'required|numeric',
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:255',
            'correo' => 'required|string|email|max:255',
            'direccion_ip' => 'required|string|max:255',
            'agente_usuario' => 'required|string|max:255',
            'carga_util' => 'required|string|max:255',
            'ultima_actividad' => 'required|date',
        ]);

        $centro->update($data);

        // Return the updated center
        return response()->json($centro, 200);
    }
}

