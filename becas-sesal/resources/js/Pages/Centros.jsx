import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Centros = ({ auth }) => {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Centros de Estudio" />
            <div>Centros</div>
        </AuthenticatedLayout>
    );
};

export default Centros;
