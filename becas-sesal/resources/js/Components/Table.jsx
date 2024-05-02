import { Input } from "postcss";
import React from "react";
import { useTable, useFilters, usePagination } from "react-table";
import TextInput from "./TextInput";
import InputLabel from "./InputLabel";

const Table = ({ data }) => {
    console.log(data);
    const columns = React.useMemo(
        () => [
            {
                Header: () => (
                    <InputLabel className="text-lg" value={"Nombres"} />
                ),
                accessor: "nombres",
                Filter: DefaultColumnFilter,
            },
            {
                Header: () => (
                    <InputLabel className="text-lg" value={"Identidad"} />
                ),
                accessor: "identidad",
                Filter: DefaultColumnFilter,
            },
            {
                Header: () => (
                    <InputLabel className="text-lg" value={"Tipo de Beca"} />
                ),
                accessor: "tipo_de_beca",
                Filter: DefaultColumnFilter,
                Cell: ({ value }) => <div className="text-left">{value}</div>,
            },
            {
                Header: () => (
                    <InputLabel className="text-lg" value={"Monto"} />
                ),
                accessor: "monto_de_la_beca",
                Filter: DefaultColumnFilter,
                Cell: ({ value }) =>
                    new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "HNL",
                    }).format(value), // Add this line
                Footer: (info) => {
                    const total = React.useMemo(
                        () =>
                            info.rows.reduce(
                                (sum, row) => row.values.monto_de_la_beca + sum,
                                0
                            ),
                        [info.rows]
                    );

                    /*                     return <>Total: {total}</>;
                     */
                },
            },
            /*             {
                Header: () => (
                    <InputLabel
                        className="text-lg"
                        value={"Asignado a x lugar"}
                    />
                ),
                accessor: "centro_de_estudio_id",
                Filter: DefaultColumnFilter,
            }, */
            {
                Header: () => (
                    <InputLabel className="text-lg" value={"Fecha de Inicio"} />
                ),
                accessor: "fecha_de_inicio",
                Filter: DefaultColumnFilter,
                Cell: ({ value }) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                },
            },
            {
                Header: () => (
                    <InputLabel
                        className="text-lg"
                        value={"Fecha de Finalizacion"}
                    />
                ),
                accessor: "fecha_de_finalizacion",
                Filter: DefaultColumnFilter,
                Cell: ({ value }) => {
                    const date = new Date(value);
                    return date.toLocaleDateString();
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        footerGroups,
        page,
        rows,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable({ columns, data }, useFilters, usePagination); // Add usePagination here
    return (
        <section className="flex flex-col items-center justify-center">
            <table {...getTableProps()} className="">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                    <div>
                                        {column.canFilter
                                            ? column.render("Filter")
                                            : null}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()} className="">
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className="text-left px-4 py-2 border rounded border-gray-600"
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    {footerGroups.map((group) => (
                        <tr {...group.getFooterGroupProps()}>
                            {group.headers.map((column) => (
                                <td {...column.getFooterProps()}>
                                    {column.render("Footer")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            <div>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {"<"}
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {">>"}
                </button>{" "}
                <span>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    | Go to page:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(page);
                        }}
                        style={{ width: "100px" }}
                    />
                </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Mostrar {pageSize} datos
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
};

export default Table;

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length;

    return (
        <div>
            <TextInput
                className="w-[10rem] h-8 px-2 my-2 mx-1"
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined);
                }}
                placeholder={`Buscar entre ${count} registros...`}
            />
        </div>
    );
}
