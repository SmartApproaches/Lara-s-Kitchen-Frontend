import { useCallback } from "react";

export const useCSVExport = () => {
  const exportToCSV = useCallback((rows, filename) => {
    if (!rows || rows.length === 0) {
      console.log("No data to export");
      return;
    }

    const headers = Object.keys(rows[0]).filter((key) => key !== "key");

    const csvContent = [
      headers.map((header) => `"${header.replace(/"/g, '""')}"`).join(","),
      ...rows.map((row) =>
        headers
          .map((field) => {
            let value = row[field] || "";
            value = String(value).replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return { exportToCSV };
};
