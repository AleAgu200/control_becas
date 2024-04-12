<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Beca;
use Carbon\Carbon;
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

    public function getScholarshipReport(Request $request)
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

        // Return results as JSON
        return response()->json($results);
    }
}
