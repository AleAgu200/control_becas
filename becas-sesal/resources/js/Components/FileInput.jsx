import { useState } from "react";
import axios from "axios";
import { Link } from "@inertiajs/react";
import PrimaryButton from "./PrimaryButton";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/75UzR2liV22
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function FileInput() {
    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null); // Add this line
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            setFile(file);
        } else {
            console.log("No file selected");
        }
    };
    const uploadFile = async () => {
        const formData = new FormData();
        formData.append("file", file, file.name);
        try {
            const response = await axios.post(
                "/api/uploadexcelimport",
                formData
            );

            console.log(response.data);
        } catch (error) {
            console.error("File upload failed", error);
        }
    };
    const clearState = () => {
        setFileName("");
        setFile(null);
        document.getElementById("archivo").value = null;
    };
    return (
        <div className="w-full max-w-md mx-auto bg-white rounded shadow-lg p-6 dark:bg-gray-950">
            <div className="flex flex-col items-center justify-center space-y-4 ">
                <FileSpreadsheetIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                <h2 className="text-2xl font-bold">Subir archivo</h2>
                <p className="text-gray-500 dark:text-gray-400">
                    Arrastre y suelte aqui el archivo que desea subir.
                </p>
                <div className="w-full border-2 border-gray-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center space-y-4 hover:border-gray-500 transition-colors dark:border-gray-700 dark:hover:border-gray-500">
                    <UploadIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Arrastre el archivo que desea subir{" "}
                    </p>
                    <input
                        accept=".xlsx, .xls"
                        className="hidden"
                        id="archivo"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label
                        className="inline-flex  h-10 items-center justify-center rounded bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        htmlFor="archivo"
                    >
                        Buscar en el ordenador
                    </label>

                    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 dark:bg-gray-950">
                        {/* ... */}
                        <p className="text-gray-500 dark:text-gray-400">
                            {fileName
                                ? `Archivo seleccionado: ${fileName}`
                                : "No ha seleccionado ningun archivo."}
                        </p>
                        {/* ... */}

                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={clearState}
                                className="bg-red-700 rounded text-gray-50  p-2 hover:bg-red-600 transition-colors dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={uploadFile}
                                className="bg-green-600 text-gray-50 rounded p-2 hover:bg-green-500 transition-colors dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                Subir
                            </button>

                            {/* ... */}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("beneficiarios")}
                        className="underline text-sm  text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Volver al listado de beneficiarios
                    </Link>
                </div>
            </div>
        </div>
    );
}

function FileSpreadsheetIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h2" />
            <path d="M14 13h2" />
            <path d="M8 17h2" />
            <path d="M14 17h2" />
        </svg>
    );
}

function UploadIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
    );
}
