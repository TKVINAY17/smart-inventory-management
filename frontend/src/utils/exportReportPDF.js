import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportReportPDF(sales) {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);

  doc.text(
    "SMART INVENTORY MANAGEMENT",
    105,
    20,
    { align: "center" }
  );

  doc.setFontSize(12);
  doc.setTextColor(80);

  doc.text(
    "Sales Report",
    105,
    30,
    { align: "center" }
  );

  doc.line(15, 38, 195, 38);

  autoTable(doc, {
    startY: 48,

    head: [[
      "Invoice",
      "Product",
      "Qty",
      "Unit Price",
      "Total"
    ]],

    body: sales.map((sale) => [
      sale.id,
      sale.product_name,
      sale.quantity,
      `Rs. ${sale.unit_price}`,
      `Rs. ${sale.total_price}`,
    ]),

    theme: "grid",

    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  const revenue = sales.reduce(
    (sum, sale) => sum + sale.total_price,
    0
  );

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);

  doc.text(
    `Total Sales : ${sales.length}`,
    15,
    finalY
  );

  doc.text(
    `Revenue : Rs. ${revenue.toLocaleString()}`,
    15,
    finalY + 10
  );

  doc.save("Sales_Report.pdf");
}