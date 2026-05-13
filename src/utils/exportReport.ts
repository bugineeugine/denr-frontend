import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ReportColumn<T> = {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
  width?: number;
};

export type ReportMeta = {
  title: string;
  filename: string;
  filtersSummary?: string;
};

export function exportToExcel<T>(rows: T[], columns: ReportColumn<T>[], meta: ReportMeta) {
  const data = rows.map((row) => {
    const obj: Record<string, string | number | null | undefined> = {};
    columns.forEach((c) => {
      obj[c.header] = c.accessor(row);
    });
    return obj;
  });

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = columns.map((c) => ({ wch: c.width ?? 18 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, `${meta.filename}.xlsx`);
}

export function exportToPdf<T>(rows: T[], columns: ReportColumn<T>[], meta: ReportMeta) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(20, 83, 45);
  doc.text("DENR — CENRO", 40, 40);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(meta.title, 40, 58);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 74);
  if (meta.filtersSummary) {
    doc.text(`Filters: ${meta.filtersSummary}`, 40, 88);
  }

  autoTable(doc, {
    startY: meta.filtersSummary ? 100 : 86,
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => String(c.accessor(row) ?? "—"))),
    headStyles: { fillColor: [22, 101, 52], fontSize: 9, cellPadding: 6 },
    bodyStyles: { fontSize: 8.5, cellPadding: 5, textColor: [30, 41, 59] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
  });

  doc.save(`${meta.filename}.pdf`);
}
