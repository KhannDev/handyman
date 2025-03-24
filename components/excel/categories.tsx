import dayjs from "dayjs";
import ExcelJS from "exceljs";

const notificationExportExcel = (data: any) => {
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Notifications");
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
  sheet.columns = [
    {
      header: "Name",
      key: "name",
      width: 14,
    },
    {
      header: "Created At",
      key: "createdAt",
      width: 14,
    },

    {
      header: "Created By",
      key: "createdBy",
      width: 20,
    },
  ];
  data.categories?.map((notification: any) => {
    sheet.addRow({
      name: notification.name,
      createdAt: dayjs(notification.createdAt).format("DD-MMM-YYYY hh:mm A"),
      createdBy: notification.approvedBy?.name,
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    (anchor.href = url),
      (anchor.download = "Categories.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default notificationExportExcel;
