import React from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
const Beneficiario = ({ estudiante, auth }) => {
    async function updateEstado(estudianteId, estado) {
        const response = await fetch(
            `http://localhost:8000/api/estudiante/${estudianteId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    estado: estado,
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    }
    console.log("🚀 ~ Beneficiario ~ estudiante:", estudiante);
    return (
        <AuthenticatedLayout user={auth.user} className>
            <Head title="Beneficiario" />

            <div className="h-[70dvh] p-5 mx-auto mt-5 flex flex-col items-center  bg-white shadow-md rounded w-[80%] gap-5">
                <h1>
                    Nombre Completo:
                    {estudiante.nombres + " " + estudiante.apellidos}{" "}
                </h1>
                <h1>Identidad:{estudiante.identidad} </h1>
                <h1>{estudiante.correo} </h1>
                <h1>{estudiante.direccion} </h1>
                <h1>{estudiante.estado === 0 ? "activo" : "inactivo"} </h1>
                <h1>
                    Fecha de inicio:{" "}
                    {new Date(estudiante.fecha_de_inicio).toLocaleDateString()}{" "}
                </h1>
                <h1>
                    Fecha de Finalizacion:{" "}
                    {new Date(
                        estudiante.fecha_de_finalizacion
                    ).toLocaleDateString()}{" "}
                </h1>
                <Button className="">
                    <a href="beneficiarios">
                        Volver a la lista de Beneficiarios
                    </a>
                </Button>
            </div>
        </AuthenticatedLayout>
    );
};

export default Beneficiario;
