<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BecaController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\reportesController;
use App\Http\Controllers\CentroDeEstudioController;
use Inertia\Inertia;

Route::prefix('')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->middleware(['auth', 'verified'])->name('dashboard');

    Route::get('/becas', [BecaController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('becas');
    Route::get('/beneficiarios', [EstudianteController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('beneficiarios');
    Route::get('/centros', [CentroDeEstudioController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('centros');
    Route::get('/agregar', function () {
        return Inertia::render('AddData');
    })->middleware(['auth', 'verified'])->name('agregar');

    Route::get('/reportes/{id_beca}/{startDate}/{endDate}', [reportesController::class, 'generateReport']);
    Route::get('/reportes/historico', [reportesController::class, 'generateAllHistoricReports']);
    Route::get('/scholarships', [reportesController::class, 'getScholarshipReport']);
    Route::get('/getTotalcholarshipReport', [reportesController::class, 'getTotalcholarshipReport']);
    Route::get('/getTotalcholarshipReportWihoutID', [reportesController::class, 'getTotalcholarshipReportWihoutID']);
    Route::get('/getTotalMonthlyReport', [reportesController::class, 'getTotalMonthlyReport']);
    Route::get('/getTotalMonthlyReportByScholarship', [reportesController::class, 'getTotalMonthlyReportByScholarship']);
    Route::get('/allBecas', [BecaController::class, 'allBecas']);
    Route::get('/getStudent', [EstudianteController::class, 'getStudent']);
    Route::put('/updateStudent/{identidad}', [EstudianteController::class, 'updateEstudiante']);
    Route::post('/estudiantes/registrar', [EstudianteController::class, 'registrarEstudiante'])->name('estudiantes.registrar');
    Route::middleware('auth')->group(function () {
        Route::post('/api/uploadexcelimport', [EstudianteController::class, 'import'])->name('import');
    });

    Route::post('/centros/registrar', [CentroDeEstudioController::class, 'registrarCentro'])->name('centros.registrar');
    Route::get('/centros/{id}', [CentroDeEstudioController::class, 'getCentro'])->name('centros.get');
    Route::post('/centros/import', [CentroDeEstudioController::class, 'import'])->name('centros.import');
    Route::put('/centros/{id}', [CentroDeEstudioController::class, 'updateCentro'])->name('centros.update');

    

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::post('/estudiantes', [EstudianteController::class, 'registrarEstudiante'])->name('estudiantes.store');
});

require __DIR__ . '/auth.php';