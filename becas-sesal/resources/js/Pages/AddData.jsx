import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../Components/ui/tabs";
import FileInput from "../Components/FileInput";

const AddData = ({ auth }) => {
    return (
        <div>
            <AuthenticatedLayout user={auth.user}>
                <Head title="Dashboard" />
                <div className="py-12">
                    <div className="mx-auto sm:px-6 lg:px-8 max-w-[60%] bg-white shadow-lg p-5">
                        <Tabs defaultValue="account" className="w-[400px] ">
                            <TabsList className="rounded">
                                <TabsTrigger value="account">
                                    Agregar Beneficiario
                                </TabsTrigger>
                                <TabsTrigger value="centro">
                                    Agregar Centro
                                </TabsTrigger>
                                <TabsTrigger value="file">
                                    Agregar Beneficiarios desde archivo
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="file">
                                <FileInput />
                            </TabsContent>
                            <TabsContent className="" value="account">
                                <CreateStudent />
                            </TabsContent>
                            <TabsContent value="centro">
                                <CreateCentro id_usuario={auth.user.id} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
};

export default AddData;

function CreateStudent() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombres: "",
        apellidos: "",
        identidad: "",
        carnet: "",
        correo: "",
        telefono: "",
        direccion: "",
        estado: 1,
        fecha_de_inicio: "",
        fecha_de_finalizacion: "",
        id_beca: "",
        centro_de_estudio_id: "",
    });

    const formFields = {
        nombres: { type: "text", label: "Nombres" },
        apellidos: { type: "text", label: "Apellidos" },
        identidad: { type: "text", label: "Identidad" },
        carnet: { type: "text", label: "Carnet" },
        correo: { type: "email", label: "Correo" },
        telefono: { type: "tel", label: "Telefono" },
        direccion: { type: "text", label: "Direccion" },
        estado: {
            type: "select",
            label: "Estado",
            options: [
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
        },
        fecha_de_inicio: { type: "date", label: "Fecha de Inicio" },
        fecha_de_finalizacion: { type: "date", label: "Fecha de Finalizacion" },
        id_beca: {
            type: "select",
            label: "Tipo de beca",
            options: [
                { value: 1, label: "Servicio Social, Quimicos Farmaceuticos" },
                { value: 2, label: "Servicio Social, Odontología" },
                { value: 3, label: "Servicio Social, Enfemeras Profesionales" },
                {
                    value: 4,
                    label: "Servicio Social, Auxiliares de Enfermería",
                },
                { value: 5, label: "Servicio Social, Médicos" },
                { value: 6, label: "Servicio Social, Microbiología" },
                {
                    value: 7,
                    label: "Servicio Social, Internado Rotatorio de Medicina",
                },
                { value: 8, label: "Servicio Social, Técnicos en Laboratorio" },
                { value: 9, label: "Servicio Social, Técnicos en Rayos X" },
                { value: 10, label: "Servicio Social, Técnicos en Anestesia" },
                {
                    value: 11,
                    label: "Servicio Social, Técnico en Salud Ambiental",
                },
                {
                    value: 12,
                    label: "Servicio Social, Licenciadas en Nutrición",
                },
                { value: 13, label: "Becas al Exterior" },
                { value: 14, label: "Maestrías Nacionales" },
                { value: 15, label: "Posgrados en Medicina" },
                { value: 16, label: "Curso Técnicos en Laboratorio" },
                { value: 17, label: "Curso Técnicos en Anestesia" },
                { value: 18, label: "Curso Técnicos en Rayos X" },
                { value: 19, label: "Curso Auxiliares de Enfermería" },
                { value: 20, label: "Curso Técnicos en Salud Ambiental" },
                { value: 21, label: "Curso Técnicos Básicas en quirófano" },
            ],
        },
        centro_de_estudio_id: { type: "number", label: "Centro de Estudio ID" },
    };

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("Beneficiarios.store")); // Adjust this to your actual route
    };

    return (
        <form onSubmit={submit}>
            <div>
                {Object.keys(formFields).map((key) => (
                    <div key={key}>
                        <InputLabel
                            htmlFor={key}
                            value={formFields[key].label}
                        />
                        {formFields[key].type === "select" ? (
                            <select
                                id={key}
                                name={key}
                                value={data[key]}
                                className="mt-1 block w-full rounded"
                                onChange={(e) => setData(key, e.target.value)}
                                required
                            >
                                {formFields[key].options.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <TextInput
                                id={key}
                                type={formFields[key].type}
                                name={key}
                                value={data[key]}
                                className="mt-1 block w-full"
                                onChange={(e) => setData(key, e.target.value)}
                                required
                            />
                        )}
                        <InputError message={errors[key]} className="mt-2" />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href={route("beneficiarios")}
                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Volver al listado de beneficiarios
                </Link>

                <PrimaryButton className="ms-4" disabled={processing}>
                    Registrar Beneficiario
                </PrimaryButton>
            </div>
        </form>
    );
}

function CreateCentro({ id_usuario }) {
    console.log("🚀 ~ CreateCentro ~ id_usuario:", id_usuario);
    const { data, setData, post, processing, errors, reset } = useForm({
        id_usuario: id_usuario,
        nombre: "",
        direccion: "",
        telefono: "",
        correo: "",
        agente_usuario: navigator.userAgent,
        carga_util: "",
        ultima_actividad: Date.now(),
        director_centro: "",
    });

    const formFields = {
        nombre: { type: "text", label: "Nombre del centro" },
        director_centro: {
            type: "text",
            label: "Nombre del director del centro",
        },
        direccion: { type: "text", label: "Direccion" },
        telefono: { type: "tel", label: "Telefono" },
        correo: { type: "email", label: "Correo" },
    };

    useEffect(() => {
        return () => {
            reset();
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("Centros.store")); // Adjust this to your actual route
    };

    return (
        <form onSubmit={submit}>
            {Object.keys(formFields).map((key) => (
                <div key={key}>
                    <InputLabel htmlFor={key} value={formFields[key].label} />
                    <TextInput
                        id={key}
                        type={formFields[key].type}
                        name={key}
                        value={data[key]}
                        className="mt-1 block w-full"
                        onChange={(e) => setData(key, e.target.value)}
                        required
                    />
                    <InputError message={errors[key]} className="mt-2" />
                </div>
            ))}

            <div className="flex items-center justify-end mt-4">
                <Link
                    href={route("centros")}
                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Volver al listado de centros
                </Link>

                <PrimaryButton className="ms-4" disabled={processing}>
                    Registrar Centro
                </PrimaryButton>
            </div>
        </form>
    );
}
