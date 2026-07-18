import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportReportExcel(sales) {
  const data = sales.map((sale) => ({
    Invoice: sale.id,
    Product: sale.product_name,
    Quantity: sale.quantity,
    "Unit Price": sale.unit_price,
    Total: sale.total_price,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sales Report"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(file, "Sales_Report.xlsx");
}