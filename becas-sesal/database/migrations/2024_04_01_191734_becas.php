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
            $table->string('Tipo de Beca');
            $table->float('Monto de la beca', 8, 8);
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
            $table->date('Fecha de inicio');
            $table->date('Fecha de finalizacion');
            $table->string('id_beca');
            $table->unsignedBigInteger('centro_de_estudio_id'); // Add this lin
        });

        Beca::insert(
            [
                [
                    'Tipo de Beca' => 'Servicio Social, Quimicos Farmaceuticos',
                    'Monto de la beca' => 4800.00,
                    'duracion' => 12,
                    'codigo_planilla' => 19

                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Odontología',
                    'Monto de la beca' => 5300.00,
                    'duracion' => 12,
                    'codigo_planilla' => 14
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Enfemeras Profesionales',
                    'Monto de la beca' => 3000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 16
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Auxiliares de Enfermería',
                    'Monto de la beca' => 3800.00,
                    'duracion' => 12,
                    'codigo_planilla' => 17
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Médicos',
                    'Monto de la beca' => 7744.00,
                    'duracion' => 12,
                    'codigo_planilla' => 13
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Microbiología',
                    'Monto de la beca' => 7000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 15
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Internado Rotatorio de Medicina',
                    'Monto de la beca' => 6600.00,
                    'duracion' => 12,
                    'codigo_planilla' => 18
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Técnicos en Laboratorio',
                    'Monto de la beca' => 4700.00,
                    'duracion' => 12,
                    'codigo_planilla' => 10
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Técnicos en Rayos X',
                    'Monto de la beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 9
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Técnicos en Anestesia',
                    'Monto de la beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 11
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Técnico en Salud Ambiental',
                    'Monto de la beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 30
                ],
                [
                    'Tipo de Beca' => 'Servicio Social, Licenciadas en Nutrición',
                    'Monto de la beca' => 4786.00,
                    'duracion' => 12,
                    'codigo_planilla' => 50
                ],
                [
                    'Tipo de Beca' => 'Becas al Exterior',
                    'Monto de la beca' => 14000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500
                ],
                [
                    'Tipo de Beca' => 'Maestrías Nacionales',
                    'Monto de la beca' => 15000.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500

                ],
                [
                    'Tipo de Beca' => 'Posgrados en Medicina',
                    'Monto de la beca' => 21400.00,
                    'duracion' => 12,
                    'codigo_planilla' => 500

                ],
                [
                    'Tipo de Beca' => 'Curso Técnicos en Laboratorio ',
                    'Monto de la beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 6
                ],
                [
                    'Tipo de Beca' => 'Curso Técnicos en Anestesia ',
                    'Monto de la beca' => 950.00,
                    'duracion' => 18,
                    'codigo_planilla' => 7
                ],
                [
                    'Tipo de Beca' => 'Curso Técnicos en Rayos X ',
                    'Monto de la beca' => 950.00,
                    'duracion' => 18,
                    'codigo_planilla' => 5
                ],
                [
                    'Tipo de Beca' => 'Curso Auxiliares de Enfermería ',
                    'Monto de la beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 4
                ],
                [
                    'Tipo de Beca' => 'Curso Técnicos en Salud Ambiental ',
                    'Monto de la beca' => 950.00,
                    'duracion' => 12,
                    'codigo_planilla' => 29
                ],
                [
                    'Tipo de Beca' => 'Curso Técnicos Básicas en quirófano ',
                    'Monto de la beca' => 950.00,
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
