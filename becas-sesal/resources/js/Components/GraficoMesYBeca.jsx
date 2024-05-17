import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { cn } from "../utils/utils";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Spinner from "./Spinner";

export function ComboboxDemo({ becaId, setBecaId }) {
    const [becas, setBecas] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [id, setid] = React.useState(becaId);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        fetch("/allBecas")
            .then((response) => response.json())
            .then((data) => {
                setBecas(data);
                setIsLoading(false);
            });
    }, []);

    return isLoading ? (
        <Spinner></Spinner>
    ) : (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[400px] justify-between"
                >
                    {id && becas
                        ? becas.find((beca) => beca.id === id)?.tipo_de_beca
                        : "Seleccione la beca..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0">
                <Command>
                    <CommandInput placeholder="Search beca..." />
                    <CommandList>
                        <CommandEmpty>
                            No se encontro la beca buscada
                        </CommandEmpty>
                        <CommandGroup>
                            {becas.map((beca, index) => (
                                <CommandItem
                                    key={index}
                                    id={beca.id}
                                    onSelect={() => {
                                        setid(beca.id);
                                        setBecaId(beca.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            id === beca.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {beca.tipo_de_beca}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

const Graficas = () => {
    const [becaId, setBecaId] = React.useState();
    const [data, setData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filteredData, setFilteredData] = React.useState();
    const [chartData, setChartData] = React.useState();
    const monthsInSpanish = [
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
    React.useEffect(() => {
        fetch("/getTotalMonthlyReportByScholarship")
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setIsLoading(false);
            });
    }, []);
    React.useEffect(() => {
        setFilteredData(
            data.filter((item) => item.scholarshipId === becaId)[0]
        );

        setChartData(chartData);
    }, [becaId]);

    React.useEffect(() => {
        if (!filteredData) return;
        const chartData = filteredData.monthlyResults.map((item) => {
            return {
                mes: monthsInSpanish[item.month - 1],
                monto: item.total,
            };
        });
        setChartData(chartData);
        console.log("🚀 ~ React.useEffect ~ chartData:", chartData);
    }, [becaId, filteredData]);

    return isLoading ? (
        <Spinner></Spinner>
    ) : (
        <div className="h-[100dvh] flex flex-col items-center m-4">
            <ComboboxDemo becaId={becaId} setBecaId={setBecaId} />
            {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="monto" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[20vh] flex items-center justify-center">
                    <span className="">
                        Seleccione una beca para visualizar los graficos
                    </span>
                </div>
            )}
        </div>
    );
};

export default Graficas;

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded p-5 ">
                <p className="label">{`Mes : ${payload[0].payload.mes}`}</p>
                <p className="intro">{`Amount : ${new Intl.NumberFormat(
                    "en-US",
                    {
                        style: "currency",
                        currency: "HNL",
                    }
                ).format(payload[0].value)}`}</p>
            </div>
        );
    }

    return null;
};
