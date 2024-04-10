import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import InputDatePicker from "@/Components/InputDatePicker";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import InputLabel from "@/Components/InputLabel";
import Indicadores from "@/Components/Indicadores";
const Becas = ({ auth, becas, estudiantes }) => {
    console.log("🚀 ~ Becas ~ estudiantes:", estudiantes);
    const [date1, setDate1] = React.useState(
        new Date(
            new Date().getFullYear() - 1,
            new Date().getMonth(),
            new Date().getDate()
        )
    );
    const [date2, setDate2] = React.useState(
        new Date(new Date().getFullYear(), 11, 31)
    );
    const [tipoDeBeca, setTipoDeBeca] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [beneficiarios, setBeneficiarios] = React.useState([]);
    useEffect(() => {
        if (tipoDeBeca.id !== undefined) {
            const startDate = new Date(date1);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date2);
            endDate.setHours(0, 0, 0, 0);

            const filteredBeneficiarios = estudiantes.filter((estudiante) => {
                const estudianteStartDate = new Date(
                    estudiante.fecha_de_inicio
                );
                estudianteStartDate.setHours(0, 0, 0, 0);

                const estudianteEndDate = new Date(
                    estudiante.fecha_de_finalizacion
                );
                estudianteEndDate.setHours(0, 0, 0, 0);

                return (
                    estudiante.id_beca == tipoDeBeca.id &&
                    estudianteStartDate >= startDate &&
                    estudianteEndDate <= endDate
                );

                //calcular el monto a ejecutar

                //calcular la cantidad de beneficiarios
            });

            setBeneficiarios(filteredBeneficiarios);
            console.log("Filtered Beneficiarios:", filteredBeneficiarios);
        } else if (tipoDeBeca.id === undefined) {
            const startDate = new Date(date1);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date2);
            endDate.setHours(0, 0, 0, 0);

            const filteredBeneficiarios = estudiantes.filter((estudiante) => {
                const estudianteStartDate = new Date(
                    estudiante.fecha_de_inicio
                );
                estudianteStartDate.setHours(0, 0, 0, 0);

                const estudianteEndDate = new Date(
                    estudiante.fecha_de_finalizacion
                );
                estudianteEndDate.setHours(0, 0, 0, 0);

                return (
                    estudianteStartDate >= startDate &&
                    estudianteEndDate <= endDate
                );
            });

            setBeneficiarios(filteredBeneficiarios);
            console.log("Filtered Beneficiarios:", filteredBeneficiarios);
        }
    }, [tipoDeBeca, estudiantes, date1, date2]);
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Becas" />
            <div className="bg-white h-dvh">
                <div className="flex flex-row items-start justify-center  bg-white p-5">
                    <div className="flex flex-col items-center justify-center">
                        <InputLabel value={"Tipo de Beca"} />
                        <Select
                            className=""
                            onValueChange={(value) => setTipoDeBeca(value)}
                        >
                            <SelectTrigger className="w-[300px] rounded shadow-md">
                                <SelectValue
                                    placeholder="Seleccion el tipo de beca"
                                    className=""
                                >
                                    {tipoDeBeca.tipo_de_beca
                                        ? tipoDeBeca.tipo_de_beca
                                        : "Todas las becas"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={{}}>
                                        <SelectLabel>
                                            Todas las becas
                                        </SelectLabel>
                                    </SelectItem>
                                    {becas.map((beca) => (
                                        <React.Fragment key={beca.id}>
                                            <SelectItem value={beca}>
                                                <SelectLabel>
                                                    {beca.tipo_de_beca}
                                                </SelectLabel>
                                            </SelectItem>
                                            <SelectSeparator />
                                        </React.Fragment>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="">
                        <div className="flex flex-row items-center justify-center ">
                            <InputDatePicker
                                text={"Fecha de inicio"}
                                date={date1}
                                setDate={setDate1}
                            />
                            <InputDatePicker
                                text={"Fecha de fin"}
                                date={date2}
                                setDate={setDate2}
                            />
                        </div>
                    </div>
                </div>
                <Indicadores />
            </div>
        </AuthenticatedLayout>
    );
};

export default Becas;
