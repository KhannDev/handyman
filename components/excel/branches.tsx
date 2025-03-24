import dayjs from "dayjs";
import ExcelJS from "exceljs";

const branchesExportExcel = (data: any) => {
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Call-logs");
  sheet.properties.defaultRowHeight = 16;

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      bottom: { style: "medium" }, // Thick bottom border under the header row
    };
  });
  sheet.getRow(1).font = {
    name: "Arial",
    family: 2,
    size: 12,
    bold: true,
  };

  let columns = [
    { header: "Branch Name", key: "BranchName", width: 20 },
    { header: "Status", key: "Status", width: 14 },
    { header: "Partner Name", key: "PartnerName", width: 20 },
    { header: "Category", key: "Category", width: 20 },
    { header: "Created At(Date)", key: "CreatedAtDate", width: 20 },
  ];

  // Dynamically add subservice columns
  const maxSubservices = Math.max(
    ...data.map((item: any) => item.subServiceIds.length || 0)
  );

  for (let i = 1; i <= maxSubservices; i++) {
    columns.push(
      { header: `Service ${i} Name`, key: `Subservice${i}Name`, width: 20 },
      {
        header: `Service ${i} Price`,
        key: `Subservice${i}Price`,
        width: 14,
      },
      {
        header: `Service ${i} Duration`,
        key: `Subservice${i}Duration`,
        width: 18,
      }
    );
  }

  sheet.columns = columns;

  data?.forEach((customer: any) => {
    let row: any = {
      BranchName: customer.name,
      Status: customer.status,
      PartnerName: customer.partnerId?.name || "N/A",
      Category: customer.category?.name || "N/A",
      CreatedAtDate: dayjs(customer.createdAt).format("DD-MMM-YYYY hh:mm A"),
    };

    // Add subservice details dynamically
    customer.subServiceIds.forEach((subService: any, index: number) => {
      row[`Subservice${index + 1}Name`] = subService.subservice.name || "N/A";
      row[`Subservice${index + 1}Price`] = subService.price || "N/A";
      row[`Subservice${index + 1}Duration`] =
        subService.serviceDuration || "N/A";
    });

    sheet.addRow(row);
  });

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Branches.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};

export default branchesExportExcel;
