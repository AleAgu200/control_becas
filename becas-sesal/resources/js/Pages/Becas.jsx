import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const Becas = ({ auth, becas }) => {
    console.log(becas);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Becas" />
            <div>Becas</div>
        </AuthenticatedLayout>
    );
};

export default Becas;
