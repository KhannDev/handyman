import dayjs from "dayjs";
import ExcelJS from "exceljs";

const branchesExportExcel = (data: any) => {
  console.log(data);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Call-logs");
  sheet.properties.defaultRowHeight = 16;
  sheet.getRow(1).font = {
    name: "Arial",
    family: 2,
    size: 12,
    bold: true,
  };
  sheet.columns = [
    {
      header: "Branch Name",
      key: "BranchName",
      width: 14,
    },
    {
      header: "Status",
      key: "Status",
      width: 14,
    },
    {
      header: "Partner Name",
      key: "PartnerName",
      width: 14,
    },
    {
      header: "Category",
      key: "Category",
      width: 20,
    },
    {
      header: "Created At(Date)",
      key: "CreatedAtDate",
      width: 20,
    },
    {
      header: "Time",
      key: "CreatedTime",
      width: 14,
    },
    {
      header: "Approved By",
      key: "ApprovedBy",
      width: 20,
    },
    {
      header: "Approval Date",
      key: "ApprovalDate",
      width: 14,
    },
    {
      header: "Time",
      key: "ApprovalTime",
      width: 14,
    },
  ];
  data?.map((customer: any) => {
    sheet.addRow({
      BranchName: customer.name,
      Status: customer.status,
      PartnerName: customer.partnerId.name,
      Category: customer.category.name,
      CreatedAtDate: dayjs(customer.createdAt).format("DD-MMM-YYYY"),
      CreatedTime: dayjs(customer.createdAt).format("hh:mm A"),
      ApprovedBy: customer.approvedBy?.name,
      ApprovalDate: customer.approvedDate
        ? dayjs(customer.approvedDate).format("DD-MMM-YYYY")
        : "",
      ApprovalTime: customer.approvedDate
        ? dayjs(customer.approvedDate).format("hh:mm A")
        : "",
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    (anchor.href = url),
      (anchor.download = "Branches.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default branchesExportExcel;
