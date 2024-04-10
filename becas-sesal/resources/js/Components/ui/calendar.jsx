import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "../../utils/utils";
import { buttonVariants } from "@/Components/ui/button";

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
    return (
        <DayPicker
            locale={es}
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                ),
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                    "text-blue-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-blue-400",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-blue-100/50 [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 dark:[&:has([aria-selected].day-outside)]:bg-blue-800/50 dark:[&:has([aria-selected])]:bg-blue-800",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-blue-700 text-blue-50 hover:bg-blue-700 hover:text-blue-50 focus:bg-blue-700 focus:text-blue-50 dark:bg-blue-50 dark:text-blue-700 dark:hover:bg-blue-50 dark:hover:text-blue-700 dark:focus:bg-blue-50 dark:focus:text-blue-700 text-white",
                day_today:
                    "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-50",
                day_outside:
                    "day-outside text-blue-500 opacity-50 aria-selected:bg-blue-100/50 aria-selected:text-blue-500 aria-selected:opacity-30 dark:text-blue-400 dark:aria-selected:bg-blue-800/50 dark:aria-selected:text-blue-400",
                day_disabled: "text-blue-500 opacity-50 dark:text-blue-400",
                day_range_middle:
                    "aria-selected:bg-blue-100 aria-selected:text-blue-700 dark:aria-selected:bg-blue-800 dark:aria-selected:text-blue-50",
                day_hidden: "invisible",
                ...classNames,
            }}
            components={{
                IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                IconRight: ({ ...props }) => (
                    <ChevronRight className="h-4 w-4" />
                ),
            }}
            {...props}
        />
    );
}
Calendar.displayName = "Calendar";

export { Calendar };
