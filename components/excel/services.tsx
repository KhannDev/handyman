import dayjs from "dayjs";
import ExcelJS from "exceljs";

const toggleExportexcel = (data: any, name: any, date: any) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Users");
  sheet.properties.defaultRowHeight = 16;
  sheet.getRow(1).font = {
    name: "Arial",
    family: 2,
    size: 12,
    bold: true,
  };
  sheet.columns = [
    {
      header: "Date",
      key: "Date",
      width: 25,
    },
    {
      header: "Time",
      key: "Time",
      width: 14,
    },
    {
      header: "Status",
      key: "Status",
      width: 20,
    },
  ];

  if (data) {
    data.forEach((user: any, index: number, array: any[]) => {
      const loginStatus = user.status ? "Active" : "Inactive";
      const isFirstRow = index === 0;
      const isLastRow = index === array.length - 1;
      const isFirstElementTrue = array[0]?.status;
      const isLastElementFalse = !array[array.length - 1]?.status;

      let modifiedLoginStatus = loginStatus;

      // Modify the login status for the first row and last row based on conditions
      if (isFirstRow && isFirstElementTrue) {
        modifiedLoginStatus = "Active-Login";
      } else if (isLastRow && isLastElementFalse) {
        modifiedLoginStatus = "Inactive-Logout";
      }

      sheet.addRow({
        Date: dayjs(user?.createdAt).format("DD-MMM-YYYY"),
        Time: dayjs(user?.createdAt).format("hh:mm:ss A"),
        Status: modifiedLoginStatus,
      });
    });
  }

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${name}-${date}.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};

export default toggleExportexcel;
