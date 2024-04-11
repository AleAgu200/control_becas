<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Beca;
use Carbon\Carbon;
use DateTime;
use Illuminate\Http\Request;

class reportesController extends Controller
{
    public function generateReportOld($id_beca, $startDate, $endDate)
    {
        $startDate = new DateTime($startDate);
        $endDate = new DateTime($endDate);
        $period = $startDate->diff($endDate);

        $beca = Beca::with('estudiantes')->find($id_beca);

        if (!$beca) {
            return 'Beca not found';
        }

        $report = [];
        foreach ($beca->estudiantes as $estudiante) {
            // Convert dates to Carbon instances for comparison
            $estudianteStartDate = Carbon::parse($estudiante->fecha_de_inicio);
            $estudianteEndDate = Carbon::parse($estudiante->fecha_de_finalizacion);
            $startDate = Carbon::parse($startDate);
            $endDate = Carbon::parse($endDate);

            // Check if the student's scholarship period overlaps with the specified date range
            if ($estudianteStartDate->lessThanOrEqualTo($endDate) && $estudianteEndDate->greaterThanOrEqualTo($startDate)) {
                $totalAmount = $beca->monto_de_la_beca * $beca->duracion;

                // Calculate prorated amount for the first month
                if ($estudianteStartDate->greaterThan($startDate)) {
                    $daysInMonth = $estudianteStartDate->daysInMonth;
                    $remainingDays = $daysInMonth - $estudianteStartDate->day + 1;
                    $monthlyAmount = $beca->monto_de_la_beca;
                    $proratedAmount = ($monthlyAmount / $daysInMonth) * $remainingDays;

                    // Add prorated amount to total
                    $totalAmount += $proratedAmount;
                }

                $report[] = [
                    'estudiante' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                    'totalAmount' => $totalAmount,
                ];

                // Calculate prorated amount for the last month

                $totalAmount = array_reduce($report, function ($carry, $item) {
                    return $carry + $item['totalAmount'];
                }, 0);

                $totalAmount = round($totalAmount, 2);
            }
        }

        return response()->json([
            'report' => $report,
            'period' => $period->format('%m meses %d dias'),
            'totalAmount' => $totalAmount,
        ]);
    }

    public function generateReport($id_beca = null, $startDate, $endDate)
    {
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);
        $period = $startDate->diff($endDate)->format('%m meses %d días');

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

                // Check if the student's scholarship period overlaps with the specified date range
                if ($estudianteStartDate->lessThanOrEqualTo($endDate) && $estudianteEndDate->greaterThanOrEqualTo($startDate)) {
                    // Calculate the actual duration of the scholarship within the specified date range
                    $actualStartDate = $estudianteStartDate->max($startDate);
                    $actualEndDate = $estudianteEndDate->min($endDate);
                    $actualDuration = $actualStartDate->diffInDays($actualEndDate) + 1;

                    // Calculate the daily scholarship amount
                    $dailyAmount = $beca->monto_de_la_beca / $estudianteStartDate->daysInMonth;

                    // Calculate the total scholarship amount based on the actual duration
                    $totalAmount = $dailyAmount * $actualDuration;

                    $report[] = [
                        'estudiante' => $estudiante->nombres . ' ' . $estudiante->apellidos,
                        'totalAmount' => round($totalAmount, 2),
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
}
