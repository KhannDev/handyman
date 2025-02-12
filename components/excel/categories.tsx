import dayjs from "dayjs";
import ExcelJS from "exceljs";

const notificationExportExcel = (data: any) => {
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Notifications");
  sheet.properties.defaultRowHeight = 16;
  sheet.getRow(1).font = {
    name: "Arial",
    family: 2,
    size: 12,
    bold: true,
  };
  sheet.columns = [
    {
      header: "Title",
      key: "Title",
      width: 14,
    },
    {
      header: "Body",
      key: "Body",
      width: 14,
    },

    {
      header: "Roles",
      key: "Roles",
      width: 20,
    },
    {
      header: "Date",
      key: "Date",
      width: 20,
    },
    {
      header: "Time",
      key: "Time",
      width: 14,
    },
    // {
    //   header: "End Time",
    //   key: "EndTime",
    //   width: 14,
    // },
    // {
    //   header: "Total Duration",
    //   key: "TotalDuration",
    //   width: 14,
    // },
    // {
    //   header: "Type",
    //   key: "Type",
    //   width: 14,
    // },
  ];
  data?.pushNotifications?.map((notification: any) => {
    sheet.addRow({
      Body: notification.body,
      Title: notification.title,
      Date: dayjs(notification.createdAt).format("DD-MM-YYYY"),
      Time: dayjs(notification.createdAt).format("hh:mm:ss A"),
      Roles: notification.roles.join("-"),
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    (anchor.href = url),
      (anchor.download = "notification.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default notificationExportExcel;
