<?php

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
        Schema::table('estudiantes', function (Blueprint $table) {
            $table->renameColumn('Fecha de finalizacion', 'fecha_de_finalizacion');
        });
        Schema::table('estudiantes', function (Blueprint $table) {
            $table->renameColumn('Fecha de inicio', 'fecha_de_inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('estudiantes', function (Blueprint $table) {
            $table->renameColumn('fecha_de_finalizacion', 'Fecha de finalizacion');
        });
        Schema::table('estudiantes', function (Blueprint $table) {
            $table->renameColumn('fecha_de_inicio', 'Fecha de inicio');
        });
    }
};
