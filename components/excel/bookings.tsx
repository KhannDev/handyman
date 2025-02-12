import dayjs from "dayjs";
import ExcelJS from "exceljs";

const bookingsExportExcel = (data: any) => {
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
      header: "Booking ID",
      key: "ID",
      width: 14,
    },
    {
      header: "Booking Date",
      key: "BookingDate",
      width: 14,
    },
    {
      header: "Booking Time",
      key: "BookingTime",
      width: 14,
    },
    {
      header: "Customer Name",
      key: "CustomerName",
      width: 20,
    },
    {
      header: "Partner Name",
      key: "PartnerName",
      width: 20,
    },
    {
      header: "Branch Name",
      key: "BranchName",
      width: 14,
    },
    {
      header: "Status",
      key: "Status",
      width: 20,
    },
    {
      header: "Created At(Date)",
      key: "CreatedAtDate",
      width: 14,
    },
    {
      header: "Time",
      key: "CreatedTime",
      width: 14,
    },
  ];
  data?.map((customer: any) => {
    sheet.addRow({
      ID: customer.bookingId,
      Status: customer.status,
      BookingDate: dayjs(customer.bookedTime).format("DD-MMM-YYYY"),
      BookingTime: dayjs(customer.bookedTime).format("hh:mm A"),
      CustomerName: customer.customer.name,
      PartnerName: customer.partner.name,
      BranchName: customer.service.name,
      CreatedAtDate: dayjs(customer.createdAt).format("DD-MMM-YYYY"),
      CreatedTime: dayjs(customer.createdAt).format("hh:mm A"),
    });
  });
  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreedsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    (anchor.href = url),
      (anchor.download = "Bookings.xlsx"),
      anchor.click(),
      window.URL.revokeObjectURL(url);
  });
};

export default bookingsExportExcel;
