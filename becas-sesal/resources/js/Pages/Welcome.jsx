import { Button } from "@/Components/ui/button";
import { Card, CardTitle } from "@/Components/ui/card";
import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(circle_at_12px_12px,#14f1fc_1px,transparent_1px)] bg-[size:24px_24px]">
            {" "}
            <Head title="Welcome" />
            <div className="flex flex-col items-center justify-center gap-10 w-[90%] h-[100dvh] mx-auto mt-auto ">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Logo_de_SESAL.svg/512px-Logo_de_SESAL.svg.png"
                    alt="Logo Sesal"
                    className="w-1/3 mx-auto mt-5"
                />
                <CardTitle className="text-center">
                    Bienvenido a la plataforma de becas de la SESAL
                </CardTitle>
                <LoginRegisterButtons auth={auth} />
            </div>
        </div>
    );
}

import React from "react";

const LoginRegisterButtons = ({ auth }) => {
    return (
        <div>
            <nav className="-mx-3 flex flex-1 justify-center">
                {auth.user ? (
                    <Link
                        href={route("becas")}
                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                    >
                        <Button className="bg-teal-500 rounded hover:bg-teal-600">
                            Ir al menu principal
                        </Button>
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route("login")}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            <Button className="rounded ">Iniciar Sesión</Button>
                        </Link>
                        <Link
                            href={route("register")}
                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                        >
                            <Button className="rounded bg-teal-500 hover:bg-teal-600">
                                Registrarse
                            </Button>
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );
};
