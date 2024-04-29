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
        return <div>Loading...</div>; // Or render a loading spinner
    }

    const totalPages = Math.ceil(currentData.length / perPage);
    return (
        <Card>
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
                            <TableHead className="text-right">
                                Telefono
                            </TableHead>
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
                                        item.fecha_de_inicio
                                    ).toLocaleDateString()}{" "}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.telefono}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <SimpleTablePagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
            />
        </Card>
    );
}

const SimpleTablePagination = ({ page, setPage, totalPages }) => {
    const handlePrevious = (event) => {
        console.log("🚀 ~ SimpleTablePagination ~ page:", page);

        event.preventDefault();
        if (page > 1) setPage(page - 1);
    };

    const handleNext = (event) => {
        event.preventDefault();
        if (page < totalPages) setPage(page + 1);
    };

    return (
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
    );
};
