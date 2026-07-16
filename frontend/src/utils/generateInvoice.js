import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(sale) {
  const doc = new jsPDF();

  // ===========================
  // Company Header
  // ===========================

  doc.setFontSize(20);
  doc.setTextColor(41, 98, 255);
  doc.text("SMART INVENTORY MANAGEMENT", 105, 20, {
    align: "center",
  });

  doc.setFontSize(12);
  doc.setTextColor(80);

  doc.text(" KVS BUYER AND SELLER ", 105, 28, {
    align: "center",
  });

  doc.line(15, 35, 195, 35);

  // ===========================
  // Invoice Details
  // ===========================

  doc.setFontSize(12);
  doc.setTextColor(0);

  doc.text(
    `Invoice No : INV-${sale.id}`,
    15,
    45
  );

  doc.text(
    `Date : ${new Date().toLocaleDateString()}`,
    15,
    53
  );

  doc.text(
    `Time : ${new Date().toLocaleTimeString()}`,
    15,
    61
  );

  // ===========================
  // Product Table
  // ===========================

  autoTable(doc, {
    startY: 75,

    head: [[
      "Product",
      "Quantity",
      "Unit Price",
      "Total"
    ]],

    body: [[
      sale.product_name,
      sale.quantity,
      `Rs. ${sale.unit_price}`,
      `Rs. ${sale.total_price}`
    ]],

    theme: "grid",

    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  // ===========================
  // Grand Total
  // ===========================

  const finalY =
    doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);

  doc.text(
    `Grand Total : Rs. ${sale.total_price}`,
    15,
    finalY
  );

  doc.setFontSize(12);

  doc.text(
    "Thank you for your purchase!",
    15,
    finalY + 15
  );

  // ===========================
  // Save
  // ===========================

  doc.save(`Invoice_${sale.id}.pdf`);
}