import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from "./ui/card";

export default function Indicadores({
    montoEjecutar,
    beneficiarios,
    ejecucion,
    periodo,
}) {
    console.log("🚀 ~ beneficiarios:", beneficiarios);

    const presupuesto = 120000000;
    return (
        <div className="flex flex-row gap-2 w-full items-center justify-center p-5 bg-white">
            <Card className="shadow-md grid gap-1.5 w-1/4">
                <CardHeader>
                    <CardTitle>Monto a ejecutar</CardTitle>
                    <CardDescription>
                        Monto a ser ejecutado por la cantidad de becas {periodo}{" "}
                        .
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                    <div className="flex-1">
                        <div className="font-semibold">
                            {" "}
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "HNL",
                            }).format(montoEjecutar)}
                        </div>
                        <div className="mt-1">Monto a ejecutar</div>
                    </div>
                    <CreditCardIcon className="w-8 h-8" />
                </CardContent>
            </Card>
            <Card className="shadow-md grid gap-1.5 w-1/4">
                <CardHeader>
                    <CardTitle>Beneficiarios</CardTitle>
                    <CardDescription>
                        Cantidad completa de beneficiarios de becas.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center">
                    <div className="flex-1">
                        <div className="font-semibold">{beneficiarios}</div>
                        <div className="mt-1">Beneficiarios </div>
                    </div>
                    <UsersIcon className="w-8 h-8" />
                </CardContent>
            </Card>
            <Card className="shadow-md grid gap-1 w-1/4 pt-1">
                <CardHeader>
                    <CardTitle>Ejecución a la fecha</CardTitle>
                    <CardDescription>
                        Comparativa de monto ejecutado y presupuesto disponible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <div className="font-semibold text-green-500">
                            {" "}
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "HNL",
                            }).format(presupuesto)}
                        </div>
                        <div className="mt-1">Presupuesto Anual</div>
                    </div>
                    <div className="h-8" />
                    <div className="flex flex-col items-center">
                        <div className="font-semibold">{ejecucion}</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CreditCardIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
    );
}

function UsersIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
