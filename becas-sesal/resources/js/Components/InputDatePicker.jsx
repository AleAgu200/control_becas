import React, { useState } from "react";
import { Calendar } from "../Components/ui/calendar";
import Dropdown from "./Dropdown";
import InputLabel from "./InputLabel";

function DropdownCalendar({ date, setDate, text }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex flex-col justify-center items-center mx-2">
            <InputLabel value={text}></InputLabel>
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button
                            type="button"
                            className="inline-flex items-center px-3 py-2 border rounded text-sm leading-4 font-medium shadow-md rounded-text-gray-500 bg-white hover:text-blue-700 focus:outline-none transition ease-in-out duration-150 lg:w-25 lg:h-10 lg:text-center focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-blue-500"
                        >
                            {date
                                ? date.toLocaleDateString("es-HN", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                  })
                                : "Seleccionar fecha "}
                            <svg
                                className="h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content align="left" width="59">
                    <Calendar
                        selected={date}
                        onDayClick={(day) => {
                            setIsOpen(false);
                            setDate(day);
                        }}
                    />
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}

export default DropdownCalendar;
