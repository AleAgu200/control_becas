<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Beca;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class reportesController extends Controller
{
    public function generateReport($id_beca = null, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);
        $period = $startDate->diff($endDate)->format('%m meses %d días');

        // Fetch the scholarships, filtering by id_beca if not '999'
        $query = Beca::with(['estudiantes' => function ($query) use ($startDate, $endDate) {
            $query->where('fecha_de_inicio', '>=', $startDate->toDateString())
                ->where('fecha_de_finalizacion', '<=', $endDate->toDateString());
        }]);

        if ($id_beca != 999) {
            $query->where('id', $id_beca);
        }

        $becas = $query->get();
        $allReports = [];
        $grandTotalAmount = 0;

        foreach ($becas as $beca) {
            $report = [];
            $totalAmountForBeca = 0;

            foreach ($beca->estudiantes as $estudiante) {
                $estudianteStartDate = Carbon::parse($estudiante->fecha_de_inicio);
                $estudianteEndDate = Carbon::parse($estudiante->fecha_de_finalizacion);

                // Ensure that date ranges overlap and calculate accordingly
                if ($estudianteStartDate < $endDate && $estudianteEndDate > $startDate) {
                    // Adjust start and end dates to within the defined range
                    $effectiveStartDate = $estudianteStartDate->max($startDate);
                    $effectiveEndDate = $estudianteEndDate->min($endDate);

                    // Calculate the total months of scholarship coverage, using the beca's defined duration
                    $totalMonths = min($effectiveStartDate->floatDiffInMonths($effectiveEndDate), $beca->duracion);

                    // Calculate the total amount based on the effective months and the beca's monthly amount
                    $totalAmount = $totalMonths * $beca->monto_de_la_beca;
                    $totalAmount = min($totalAmount, $beca->monto_de_la_beca * $beca->duracion);

                    $report[] = [
                        'estudiante' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                        'months' => floor($totalMonths), // Using floor to simulate SQL's behavior
                        'amount' => round($totalAmount, 2)
                    ];

                    $totalAmountForBeca += $totalAmount;
                }
            }

            $allReports[] = [
                'beca' => $beca->tipo_de_beca,
                'report' => $report,
                'totalAmount' => round($totalAmountForBeca, 2),
            ];

            $grandTotalAmount += $totalAmountForBeca;
        }

        return response()->json([
            'allReports' => $allReports,
            'period' => $period,
            'grandTotalAmount' => round($grandTotalAmount, 2),
        ]);
    }

    public function generateReportOld($id_beca = null, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);
        $period = $startDate->diff($endDate)->format('%y años,%m meses ,%d días');

        // Check if the id_beca is 999, if so, get all scholarships, otherwise get the specified scholarship
        $query = Beca::with('estudiantes');
        if ($id_beca != 999) {
            $query->where('id', $id_beca);
        }
        $becas = $query->get();

        $allReports = [];
        $grandTotalAmount = 0;

        foreach ($becas as $beca) {
            $report = [];
            $totalAmountForBeca = 0;

            foreach ($beca->estudiantes as $estudiante) {
                $estudianteStartDate = Carbon::parse($estudiante->fecha_de_inicio);
                $estudianteEndDate = Carbon::parse($estudiante->fecha_de_finalizacion);

                $currentDate = $estudianteStartDate->copy();

                while ($currentDate->lessThanOrEqualTo($estudianteEndDate) && $currentDate->lessThanOrEqualTo($endDate)) {
                    $monthEnd = $currentDate->copy()->endOfMonth();
                    $totalMonthAmount = 0;

                    if ($currentDate->isSameDay($currentDate->copy()->startOfMonth()) && $monthEnd->lessThanOrEqualTo($estudianteEndDate) && $monthEnd->lessThanOrEqualTo($endDate)) {
                        // Full month within the range
                        $totalMonthAmount = $beca->monto_de_la_beca;
                    } else {
                        // Partial month at the start or end of the period
                        $effectiveStartDate = $currentDate->max($startDate);
                        $effectiveEndDate = $monthEnd->min($estudianteEndDate)->min($endDate);
                        $daysInMonth = $currentDate->daysInMonth;
                        $daysActive = $effectiveStartDate->diffInDays($effectiveEndDate) + 1;
                        $dailyAmount = $beca->monto_de_la_beca / $daysInMonth;
                        $totalMonthAmount = $dailyAmount * $daysActive;
                    }

                    $report[] = [
                        'estudiante' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                        'month' => $currentDate->format('Y-m'),
                        'amount' => round($totalMonthAmount, 2)
                    ];

                    $totalAmountForBeca += $totalMonthAmount;

                    // Move to the next month
                    $currentDate->addMonth()->startOfMonth();
                }
            }

            $allReports[] = [
                'beca' => $beca->tipo_de_beca,
                'report' => $report,
                'totalAmount' => round($totalAmountForBeca, 2),
            ];

            $grandTotalAmount += $totalAmountForBeca;
        }

        return response()->json([
            'allReports' => $allReports,
            'period' => $period,
            'grandTotalAmount' => round($grandTotalAmount, 2),
        ]);
    }

    public function generateAllHistoricReports()
    {
        $becas = Beca::with(['estudiantes' => function ($query) {
            $query->orderBy('fecha_de_inicio', 'asc');
        }])->get();

        $reports = [];

        foreach ($becas as $beca) {
            $totalAmount = 0;
            $monthlyReports = [];

            foreach ($beca->estudiantes as $estudiante) {
                $estudianteStartDate = Carbon::parse($estudiante->fecha_de_inicio);
                $estudianteEndDate = Carbon::parse($estudiante->fecha_de_finalizacion);

                // Calculate the total amount for each month within the scholarship period
                while ($estudianteStartDate->lessThanOrEqualTo($estudianteEndDate)) {
                    $monthEnd = (clone $estudianteStartDate)->endOfMonth();
                    $actualStartDate = $estudianteStartDate->max($estudiante->fecha_de_inicio);
                    $actualEndDate = $estudianteEndDate->min($monthEnd);
                    $actualDuration = $actualStartDate->diffInDays($actualEndDate) + 1;

                    // Calculate the daily scholarship amount
                    $dailyAmount = $beca->monto_de_la_beca / $estudianteStartDate->daysInMonth;

                    // Calculate the total scholarship amount for the month based on the actual duration
                    $monthlyAmount = $dailyAmount * $actualDuration;

                    // Add to monthly reports
                    $monthlyReports[$estudianteStartDate->format('Y-m')] = ($monthlyReports[$estudianteStartDate->format('Y-m')] ?? 0) + $monthlyAmount;

                    // Move to the next month
                    $estudianteStartDate->addMonth();
                }
            }

            // Prepare the final report
            foreach ($monthlyReports as $month => $amount) {
                $monthlyReportsFormatted[] = [
                    'month' => $month,
                    'amount' => round($amount, 2),
                ];
                $totalAmount += $amount;
            }

            $reports[] = [
                'beca' => $beca->tipo_de_beca,
                'totalAmount' => round($totalAmount, 2),
                'monthlyReports' => $monthlyReportsFormatted ?? [],
            ];
        }

        return response()->json($reports, 200, [], JSON_PRETTY_PRINT);
    }

    public function getScholarshipReportSemiCorrect(Request $request)
    {
        // Retrieve query parameters
        $start_date = $request->input('start_date', '2023-01-01'); // Default if not provided
        $end_date = $request->input('end_date', '2024-02-29'); // Default if not provided
        $scholarship_id = $request->input('scholarship_id', 1); // Default if not provided

        // Perform the query using Query Builder with raw SQL for julianday calculations
        $results = DB::table('estudiantes')
            ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
            ->select(
                'estudiantes.*',
                DB::raw("((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375) AS months"),
                DB::raw("MIN(12, ((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375)) * becas.monto_de_la_beca AS total")
            )
            ->where('estudiantes.id_beca', '=', $scholarship_id)
            ->where('fecha_de_inicio', '>=', $start_date)
            ->where('fecha_de_inicio', '<=', $end_date)
            ->get();

        /* calculate the whole amount */
        $total = 0;
        foreach ($results as $result) {
            $total += $result->total;
        }

        // Return results as JSON
        return response()->json([
            'results' => $results,
            'total' => $total,
        ]);
    }

    public function getScholarshipReport(Request $request)
    {
        // Retrieve query parameters
        $start_date = $request->input('start_date', '2023-01-01'); // Default if not provided
        $end_date = $request->input('end_date', '2024-02-29'); // Default if not provided
        $scholarship_id = $request->input('scholarship_id', 1); // Default if not provided

        // Fetch the student and scholarship data
        $results = DB::table('estudiantes')
            ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
            ->select(
                'estudiantes.*',
                'becas.monto_de_la_beca',
                'estudiantes.fecha_de_inicio',
                DB::raw("MIN(estudiantes.fecha_de_finalizacion, '$end_date') as fecha_de_finalizacion")
            )
            ->where('estudiantes.id_beca', '=', $scholarship_id)
            ->where('fecha_de_inicio', '>=', $start_date)
            ->where('fecha_de_inicio', '<=', $end_date)
            ->get();

        $total = 0;

        // Calculate the total amount for each student
        foreach ($results as $result) {
            $startDate = Carbon::parse($result->fecha_de_inicio);
            $endDate = Carbon::parse($result->fecha_de_finalizacion);

            // Calculate the total months of scholarship coverage
            $totalMonths = min($startDate->floatDiffInMonths($endDate), 12);

            // Calculate the total amount based on the effective months and the beca's monthly amount
            $totalAmount = $totalMonths * $result->monto_de_la_beca;
            $totalAmount = min($totalAmount, $result->monto_de_la_beca * 12);

            $result->months = floor($totalMonths); // Using floor to simulate SQL's behavior
            $result->total = round($totalAmount, 2);

            $total += $totalAmount;
        }

        // Return results as JSON
        return response()->json([
            'results' => $results,
            'total' => $total,
            'cantidad' => count($results)
        ]);
    }

    public function getTotalcholarshipReport(Request $request)
    {
        // Retrieve query parameters
        $start_date = $request->input('start_date', '2023-01-01'); // Default if not provided
        $end_date = $request->input('end_date', '2024-02-29'); // Default if not provided
        $beca_id = $request->input('scholarship_id'); // Retrieve the 'scholarship_id' parameter

        // Perform the query using Query Builder with raw SQL for julianday calculations
        $results = DB::table('estudiantes')
            ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
            ->select(
                'estudiantes.*',
                DB::raw("((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375) AS months"),
                DB::raw("MIN(12, ((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375)) * becas.monto_de_la_beca AS total")
            )
            ->where('fecha_de_inicio', '>=', $start_date)
            ->where('fecha_de_inicio', '<=', $end_date)
            ->where('estudiantes.id_beca', $beca_id) // Filter by 'beca'
            ->get();

        /* calculate the whole amount */
        $total = 0;
        foreach ($results as $result) {
            $total += $result->total;
        }

        // Return results as JSON
        return response()->json([
            'results' => $results,
            'total' => $total,
            'cantidad' => count($results)
        ]);
    }

    public function getTotalcholarshipReportWihoutID(Request $request)
    {
        // Retrieve query parameters
        $start_date = $request->input('start_date', '2023-01-01'); // Default if not provided
        $end_date = $request->input('end_date', '2024-02-29'); // Default if not provided

        // Perform the query using Query Builder with raw SQL for julianday calculations
        $results = DB::table('estudiantes')
            ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
            ->select(
                'estudiantes.*',
                DB::raw("((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375) AS months"),
                DB::raw("MIN(12, ((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(fecha_de_inicio)) / 30.4375)) * becas.monto_de_la_beca AS total")
            )
            ->where('fecha_de_inicio', '>=', $start_date)
            ->where('fecha_de_inicio', '<=', $end_date)
            ->get();

        /* calculate the whole amount */
        $total = 0;
        foreach ($results as $result) {
            $total += $result->total;
        }

        // Return results as JSON
        return response()->json([
            'results' => $results,
            'total' => $total,
            'cantidad' => count($results)
        ]);
    }

    public function getTotalMonthlyReport(Request $request)
    {
        // Retrieve query parameters
        $year = $request->input('year', date('Y')); // Default to current year if not provided
        // Initialize an array to hold the results for each month
        $monthlyResults = [];

        // Loop over each month
        for ($month = 1; $month <= 12; $month++) {
            // Calculate the start and end dates for the month
            $start_date = date('Y-m-01', strtotime("$year-$month-01"));
            $end_date = date('Y-m-t', strtotime("$year-$month-01"));

            // Perform the query using Query Builder with raw SQL for julianday calculations
            $results = DB::table('estudiantes')
                ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
                ->select(
                    'estudiantes.*',
                    DB::raw("((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(MAX(fecha_de_inicio, '$start_date'))) / 30.4375) AS months"),
                    DB::raw("MIN(12, ((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(MAX(fecha_de_inicio, '$start_date'))) / 30.4375)) * becas.monto_de_la_beca AS total")
                )
                ->where('fecha_de_inicio', '<=', $end_date)
                ->where('fecha_de_finalizacion', '>=', $start_date)
                ->get();

            /* calculate the whole amount */
            $total = 0;
            foreach ($results as $result) {
                $total += $result->total;
            }

            // Add the results for the month to the monthlyResults array
            $monthlyResults[] = [
                'month' => $month,
                'results' => $results,
                'total' => $total,
                'cantidad' => count($results)
            ];
        }

        // Return results as JSON
        return response()->json($monthlyResults);
    }
    public function getTotalMonthlyReportByScholarship(Request $request)
    {
        // Retrieve query parameters
        $year = $request->input('year', date('Y')); // Default to current year if not provided

        // Retrieve all scholarship ids
        $scholarshipIds = DB::table('becas')->pluck('id');

        // Initialize an array to hold the results for each scholarship
        $scholarshipResults = [];

        // Loop over each scholarship
        foreach ($scholarshipIds as $scholarshipId) {
            // Initialize an array to hold the results for each month
            $monthlyResults = [];

            // Loop over each month
            for ($month = 1; $month <= 12; $month++) {
                // Calculate the start and end dates for the month
                $start_date = date('Y-m-01', strtotime("$year-$month-01"));
                $end_date = date('Y-m-t', strtotime("$year-$month-01"));

                // Perform the query using Query Builder with raw SQL for julianday calculations
                $results = DB::table('estudiantes')
                    ->leftJoin('becas', 'estudiantes.id_beca', '=', 'becas.id')
                    ->select(
                        'estudiantes.*',
                        DB::raw("((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(MAX(fecha_de_inicio, '$start_date'))) / 30.4375) AS months"),
                        DB::raw("MIN(12, ((julianday(MIN(fecha_de_finalizacion, '$end_date')) - julianday(MAX(fecha_de_inicio, '$start_date'))) / 30.4375)) * becas.monto_de_la_beca AS total")
                    )
                    ->where('fecha_de_inicio', '<=', $end_date)
                    ->where('fecha_de_finalizacion', '>=', $start_date)
                    ->where('estudiantes.id_beca', $scholarshipId)
                    ->get();

                /* calculate the whole amount */
                $total = 0;
                foreach ($results as $result) {
                    $total += $result->total;
                }

                // Add the results for the month to the monthlyResults array
                $monthlyResults[] = [
                    'month' => $month,
                    'results' => $results,
                    'total' => $total,
                    'cantidad' => count($results)
                ];
            }

            // Add the results for the scholarship to the scholarshipResults array
            $scholarshipResults[] = [
                'scholarshipId' => $scholarshipId,
                'monthlyResults' => $monthlyResults
            ];
        }

        // Return results as JSON
        return response()->json($scholarshipResults);
    }
}
