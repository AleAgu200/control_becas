import { useState, useEffect } from "react";
import axios from "axios";
import React, { PureComponent } from "react";
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

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "./ui/card";

const GraficoBecasPorMes = ({ beca, date1, date2 }) => {
    const formatDate = (date) => {
        const year = date.getFullYear();
        let month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
        month = month < 10 ? "0" + month : month; // prepend 0 if month is less than 10
        return `${year}-${month}`;
    };
    const formattedDate1 = formatDate(date1);
    const formattedDate2 = formatDate(date2);
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null); // <-- Add this line
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/reportes/historico").then((response) => {
            console.log("Original data:", response.data);
            // Filter by "beca"
            const filteredByBeca = response.data.filter(
                (item) => item.beca === beca
            );
            // Filter by months within "monthlyReports"
            const filteredByMonths = filteredByBeca.map((item) => {
                return {
                    ...item,
                    monthlyReports: item.monthlyReports.filter((report) => {
                        const reportDate = new Date(report.month + "-01"); // Assuming the format is "YYYY-MM"
                        return reportDate >= date1 && reportDate <= date2;
                    }),
                };
            });
            setData(filteredByMonths);
            setLoading(false);
        });
    }, [beca, date1, date2]);

    if (loading) {
        return <div>Loading...</div>;
    }

    console.log("Filtered data:", data);

    return (
        <Card className="w-[50%] border border-slate-300 rounded shadow-lg">
            <CardHeader>
                <CardTitle>Monto presupuestado</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
                <p>Card Footer</p>
            </CardFooter>
        </Card>
    );
};

export default GraficoBecasPorMes;
