import { Head } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Table from "@/Components/Table";

const Beneficiarios = ({ auth, becarios }) => {
    const [data, setData] = React.useState(becarios);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Beneficiarios" />
            {data && (
                <div className="text-sm mt-5">
                    <Table data={data} />
                </div>
            )}
        </AuthenticatedLayout>
    );
};

export default Beneficiarios;
