import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "./pagination";

export default function SimpleTable({ data }) {
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const perPage = 5;

    useEffect(() => {
        if (data) {
            setIsLoading(false);
            const start = (page - 1) * perPage;
            const end = start + perPage;
            const dataNew = data.results;
            setCurrentData(dataNew.slice(start, end));
            console.log(page, currentData);
        } else {
            setIsLoading(true); // Consider setting loading to true if data is empty
            setCurrentData([]);
        }
    }, [data, page]); // Depend on `data` and `page` to trigger updates

    if (isLoading) {
        return (
            <div className="w-[70%] mx-auto rounded-md" role="status">
                <svg
                    aria-hidden="true"
                    className="w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-teal-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        ); // Or render a loading spinner
    }

    const totalPages = Math.ceil(data.results.length / perPage);
    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };
    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };
    return (
        <Card className="w-[75%] mx-auto rounded shadow-md">
            <CardHeader className="px-7">
                <CardTitle>Beneficiarios</CardTitle>
                <CardDescription>
                    Listado de personas beneficiadas en dichas fechas y dicha
                    beca
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Identidad
                            </TableHead>
                            <TableHead className="hidden sm:table-cell">
                                Fecha de Inicio
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Fecha de Finalización
                            </TableHead>
                            <TableHead className="hidden md:table-cell">
                                Teléfono
                            </TableHead>
                            <TableHead className="text-left">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentData.map((item, index) => (
                            <TableRow key={index} className="bg-accent">
                                <TableCell>{item.nombres}</TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {item.identidad}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {new Date(
                                        item.fecha_de_inicio
                                    ).toLocaleDateString()}{" "}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {new Date(
                                        item.fecha_de_finalizacion
                                    ).toLocaleDateString()}{" "}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item.telefono}
                                </TableCell>
                                <TableCell className="text-left">
                                    {parseFloat(item.total).toFixed(3)}{" "}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="javascript:void(0)"
                                onClick={handlePrevious}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink>{page}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                href="javascript:void(0)"
                                onClick={handleNext}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </Card>
    );
}
