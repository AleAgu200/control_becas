import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import Spinner from "./Spinner";

const MonthsReports = () => {
    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("/getTotalMonthlyReport")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setIsLoading(false);
            });
    }, []);

    return isLoading ? (
        <Spinner></Spinner>
    ) : (
        <div className="h-[100dvh] m-20">
            <h1 className="text-center text-xl font-bold mt-5">
                Reporte Mensual
            </h1>
            <div className="flex flex-wrap flex-row gap-3 justify-center items-center">
                {data.map((item, index) => (
                    <Card className="shadow-md w-1/4" key={index}>
                        <CardHeader>
                            <CardTitle>
                                {monthNames[item.month - 1]}/
                                {new Date().getFullYear()}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Monto a ejecutar el mes:{" "}
                                <span className="font-bold text-black	">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "HNL",
                                    }).format(item.total)}
                                </span>{" "}
                            </CardDescription>
                            <CardDescription>
                                Total de beneficiarios:{" "}
                                <span className="font-bold text-black	">
                                    {item.cantidad}
                                </span>
                            </CardDescription>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MonthsReports;
