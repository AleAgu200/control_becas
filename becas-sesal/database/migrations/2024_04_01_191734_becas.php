<?php

use App\Models\Beca;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Centros de Estudio', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('id_usuario')->nullable()->index();
            $table->string('nombre');
            $table->string('direccion');
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();
            $table->string('direccion_ip', 45)->nullable();
            $table->text('agente_usuario')->nullable();
            $table->longText('carga_util');
            $table->integer('ultima_actividad')->index();
        });
        Schema::create('becas', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_de_beca');
            $table->float('monto_de_la_beca', 8, 8);
            $table->integer('duracion')->default(12);
            $table->integer('codigo_planilla')->nullable();
        });

        Schema::create('estudiantes', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('identidad')->unique()->required();
            $table->string('carnet');
            $table->string('correo');
            $table->string('telefono');
            $table->string('direccion');
            $table->boolean('estado')->default(true);
            $table->date('fecha_de_inicio');
            $table->date('fecha_de_finalizacion');
            $table->integer('id_beca');
            $table->unsignedBigInteger('centro_de_estudio_id'); // Add this lin
        });

        Beca::insert(
            [
                [
                    'tipo_de_beca' => 'Servicio Social, Quimicos Farmaceuticos',
                    'monto_de_la_beca' => 4800.00,
                    'duracion' => 12,
                    'codigo_planilla' => 19

                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Odontología',
                    'monto_de_la_beca' => 5300.00,
                    'duracion' => 12,
                    'codigo_planilla' => 14
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Enfemeras Profesionales',
                    'monto_de_la_beca' => 3000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 16
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Auxiliares de Enfermería',
                    'monto_de_la_beca' => 3800.00,
                    'duracion' => 12,
                    'codigo_planilla' => 17
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Médicos',
                    'monto_de_la_beca' => 7744.00,
                    'duracion' => 12,
                    'codigo_planilla' => 13
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Microbiología',
                    'monto_de_la_beca' => 7000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 15
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Internado Rotatorio de Medicina',
                    'monto_de_la_beca' => 6600.00,
                    'duracion' => 12,
                    'codigo_planilla' => 18
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Técnicos en Laboratorio',
                    'monto_de_la_beca' => 4700.00,
                    'duracion' => 12,
                    'codigo_planilla' => 10
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Técnicos en Rayos X',
                    'monto_de_la_beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 9
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Técnicos en Anestesia',
                    'monto_de_la_beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 11
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Técnico en Salud Ambiental',
                    'monto_de_la_beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 30
                ],
                [
                    'tipo_de_beca' => 'Servicio Social, Licenciadas en Nutrición',
                    'monto_de_la_beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 50
                ],
                [
                    'tipo_de_beca' => 'Becas al Exterior',
                    'monto_de_la_beca' => 14000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500
                ],
                [
                    'tipo_de_beca' => 'Maestrías Nacionales',
                    'monto_de_la_beca' => 15000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500

                ],
                [
                    'tipo_de_beca' => 'Posgrados en Medicina',
                    'monto_de_la_beca' => 21400.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500

                ],
                [
                    'tipo_de_beca' => 'Curso Técnicos en Laboratorio ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 6
                ],
                [
                    'tipo_de_beca' => 'Curso Técnicos en Anestesia ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 18,
                    'codigo_planilla' => 7
                ],
                [
                    'tipo_de_beca' => 'Curso Técnicos en Rayos X ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 18,
                    'codigo_planilla' => 5
                ],
                [
                    'tipo_de_beca' => 'Curso Auxiliares de Enfermería ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 4
                ],
                [
                    'tipo_de_beca' => 'Curso Técnicos en Salud Ambiental ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 29
                ],
                [
                    'tipo_de_beca' => 'Curso Técnicos Básicas en quirófano ',
                    'monto_de_la_beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 48
                ],

            ]

        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estudiantes');
        Schema::dropIfExists('becas');
        Schema::dropIfExists('Centros de Estudio');
    }
};
