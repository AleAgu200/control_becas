import axios from "axios";

const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const fetchReport = async (id: number, date1: Date, date2: Date) => {
    try {
        const formattedDate1 = formatDate(date1);
        const formattedDate2 = formatDate(date2);
        const response = await axios.get(
            `/reportes/${id}/${formattedDate1}/${formattedDate2}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching report:", error);
    }
};
