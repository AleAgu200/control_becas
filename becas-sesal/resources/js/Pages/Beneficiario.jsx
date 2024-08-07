import React, { useState } from "react";
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import axios from "axios";

const Beneficiario = ({ estudiante, auth }) => {
    const [estadoEstudiante, setEstadoEstudiante] = useState({
        estado: estudiante.estado,
    });

    const handleChange = (event) => {
        console.log(estudiante);

        setEstadoEstudiante((prevState) => ({
            ...prevState,
            estado: Number(event.target.value),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Call the API to update the state in the database
        await updateEstado(estudiante.identidad, estadoEstudiante.estado);
    };

    async function updateEstado(identidad, estadoEstudiante) {
        console.log("🚀 ~ Beneficiario ~ identidad:", identidad);
        try {
            const payload = {
                nombres: estudiante.nombres,
                apellidos: estudiante.apellidos,
                identidad: estudiante.identidad,
                carnet: estudiante.carnet,
                correo: estudiante.correo,
                telefono: estudiante.telefono,
                direccion: estudiante.direccion,
                estado: estadoEstudiante,
                fecha_de_inicio: estudiante.fecha_de_inicio,
                fecha_de_finalizacion: estudiante.fecha_de_finalizacion,
                id_beca: estudiante.id_beca,
                centro_de_estudio_id: estudiante.centro_de_estudio_id,
            };

            console.log("Payload:", payload); // Log the payload to check what is being sent

            const response = await axios.put(
                `http://localhost:8000/updateStudent/${identidad}`, // Use identidad as the correct identifier
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error(`HTTP error! status: ${error.response.status}`);
                console.error("Response data:", error.response.data); // Log the response data for more details
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Error", error.message);
            }
        }
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Beneficiario" />

            <div className="h-[70dvh] p-5 mx-auto mt-5 flex flex-col items-center bg-white shadow-md rounded w-[80%] gap-5">
                <h1 className="text-xl font-bold">
                    Nombre Completo:{" "}
                    {estudiante.nombres + " " + estudiante.apellidos}
                </h1>
                <h1 className="text-lg">Identidad: {estudiante.identidad} </h1>
                <h1 className="text-lg">Correo: {estudiante.correo} </h1>
                <h1 className="text-lg">Dirección: {estudiante.direccion} </h1>
                <form onSubmit={handleSubmit} className="w-full max-w-lg mt-5">
                    <div className="flex flex-col gap-3">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Estado:
                            <select
                                value={estadoEstudiante.estado}
                                onChange={handleChange}
                                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value={0}>Activo</option>
                                <option value={1}>Inactivo</option>
                            </select>
                        </label>
                    </div>
                </form>
                <h1 className="text-lg">
                    Fecha de inicio:{" "}
                    {new Date(estudiante.fecha_de_inicio).toLocaleDateString()}
                </h1>
                <h1 className="text-lg">
                    Fecha de Finalización:{" "}
                    {new Date(
                        estudiante.fecha_de_finalizacion
                    ).toLocaleDateString()}
                </h1>
                <div className="flex flex-row gap-2 mt-5">
                    <Button className="rounded bg-gray-700">
                        <a href="beneficiarios">
                            &larr; Volver a la lista de Beneficiarios
                        </a>
                    </Button>
                    <Button
                        onClick={() =>
                            updateEstado(
                                estudiante.identidad,
                                estadoEstudiante.estado
                            )
                        }
                        className="rounded bg-green-500 hover:bg-green-400"
                    >
                        Actualizar estado del Beneficiario
                    </Button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Beneficiario;
