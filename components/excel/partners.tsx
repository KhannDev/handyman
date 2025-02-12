import dayjs from "dayjs";
import ExcelJS from "exceljs";

const partnerExportexcel = (data: any) => {
  //toast.success(data?.callsCount)
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Users");
  sheet.properties.defaultRowHeight = 16;
  let columns = [
    { header: "Partner Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Mobile Number", key: "mobileNumber", width: 20 },
    { header: "Created At (Date)", key: "createdAtDate", width: 18 },
    { header: "Created At (Time)", key: "createdAtTime", width: 18 },
    { header: "Approved By", key: "approvedBy", width: 25 },
    { header: "Approval Date", key: "approvedDate", width: 18 },
    { header: "Approval Time", key: "approvedTime", width: 18 },
    { header: "Verified", key: "isVerified", width: 15 },
  ];

  const maxServices = Math.max(...data.map((p: any) => p.services.length));

  for (let i = 1; i <= maxServices; i++) {
    columns.push({ header: `Branch ${i}`, key: `branch${i}`, width: 25 });
  }

  sheet.columns = columns;
  if (data && data.length) {
    data.forEach((customer: any) => {
      let rowData: any = {
        name: customer.name || "N/A",
        email: customer.email || "N/A",
        mobileNumber: customer.mobileNumber || "N/A",
        createdAtDate: dayjs(customer.createdAt).format("DD-MMM-YYYY"),
        createdAtTime: dayjs(customer.createdAt).format("hh:mm A"),
        approvedBy: customer.approvedBy?.name || "N/A",
        approvedDate: customer.approvedDate
          ? dayjs(customer.approvedDate).format("DD-MMM-YYYY")
          : "N/A",
        approvedTime: customer.approvedDate
          ? dayjs(customer.approvedDate).format("hh:mm A")
          : "N/A",
        isVerified: customer.isVerified ? "Yes" : "No",
      };
      customer.services.forEach((service: any, index: any) => {
        rowData[`branch${index + 1}`] = service.name;
      });

      sheet.addRow(rowData);
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
      (anchor.download = "Partners.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default partnerExportexcel;
