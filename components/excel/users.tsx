import dayjs from "dayjs";
import ExcelJS from "exceljs";

const userExportexcel = (data: any) => {
  //toast.success(data?.callsCount)
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
      header: "Email",
      key: "Email",
      width: 25,
    },
    {
      header: "Name",
      key: "Name",
      width: 14,
    },
    {
      header: "Mobile Number",
      key: "MobileNumber",
      width: 20,
    },
    {
      header: "Gender",
      key: "Gender",
      width: 20,
    },
    {
      header: "CreatedAt",
      key: "CreatedAt",
      width: 20,
    },
  ];
  if (data.users) {
    data?.users?.forEach((user: any) => {
      console.log(user.email);
      sheet.addRow({
        Email: user.email,
        Name: user.name,
        MobileNumber: user.mobileNumber,
        Gender: user.gender,
        CreatedAt: dayjs(user.createdAt).format("DD-MM-YYYY"),
      });
    });
  }
  console.log(sheet);

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    (anchor.href = url),
      (anchor.download = "Users.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default userExportexcel;
