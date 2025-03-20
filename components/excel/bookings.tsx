import dayjs from "dayjs";
import ExcelJS from "exceljs";

const bookingsExportExcel = (data: any) => {
  // Precompute maximum number of statusTracker and subservice entries
  let maxStatusTrackers = 0;
  let maxSubServices = 0;
  data?.forEach((customer: any) => {
    if (Array.isArray(customer.statusTracker)) {
      maxStatusTrackers = Math.max(
        maxStatusTrackers,
        customer.statusTracker.length
      );
    }
    if (Array.isArray(customer.subServiceIds)) {
      maxSubServices = Math.max(maxSubServices, customer.subServiceIds.length);
    }
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Call-logs");
  sheet.properties.defaultRowHeight = 16;
  sheet.getRow(1).font = { name: "Arial", family: 2, size: 12, bold: true };

  // Define base columns using combined date and time.
  const baseColumns = [
    { header: "Booking ID", key: "ID", width: 14 },
    { header: "Created DateTime", key: "CreatedDateTime", width: 30 },
    { header: "Customer Name", key: "CustomerName", width: 20 },
    { header: "Booking DateTime", key: "BookingDateTime", width: 30 },
    { header: "Partner Name", key: "PartnerName", width: 20 },
    { header: "Branch Name", key: "BranchName", width: 14 },
    { header: "Status", key: "Status", width: 20 },
    { header: "Total Booking Amount", key: "TotalAmount", width: 20 },
  ];

  // Dynamic columns for statusTracker (now 4 columns per entry: status, updatedBy, name, and clubbed created date/time)
  const dynamicStatusTrackerColumns = [];
  for (let i = 1; i <= maxStatusTrackers; i++) {
    dynamicStatusTrackerColumns.push({
      header: `StatusTracker ${i}`,
      key: `StatusTracker${i}`,
      width: 20,
    });
    dynamicStatusTrackerColumns.push({
      header: `UpdatedBy ${i}`,
      key: `UpdatedBy${i}`,
      width: 15,
    });
    dynamicStatusTrackerColumns.push({
      header: `Name ${i}`,
      key: `Name${i}`,
      width: 20,
    });
    dynamicStatusTrackerColumns.push({
      header: `Status CreatedAt ${i}`,
      key: `StatusCreatedAt${i}`,
      width: 30,
    });
  }

  // Dynamic columns for subservices (3 columns per entry remain the same)
  const dynamicSubServiceColumns = [];
  for (let i = 1; i <= maxSubServices; i++) {
    dynamicSubServiceColumns.push({
      header: `Service Name ${i}`,
      key: `ServiceName${i}`,
      width: 20,
    });
    dynamicSubServiceColumns.push({
      header: `Service Duration ${i}`,
      key: `ServiceDuration${i}`,
      width: 20,
    });
    dynamicSubServiceColumns.push({
      header: `Service Price ${i}`,
      key: `ServicePrice${i}`,
      width: 20,
    });
  }

  // Set complete columns
  sheet.columns = [
    ...baseColumns,

    ...dynamicSubServiceColumns,
    ...dynamicStatusTrackerColumns,
  ];

  // Process each booking record.
  data?.forEach((customer: any) => {
    const dynamicSubServiceData: any = {};
    if (Array.isArray(customer.subServiceIds)) {
      customer.subServiceIds.forEach((subService: any, index: number) => {
        const subIndex = index + 1;
        dynamicSubServiceData[`ServiceName${subIndex}`] =
          subService.subservice?.name || "";
        dynamicSubServiceData[`ServiceDuration${subIndex}`] =
          subService.serviceDuration || "";
        dynamicSubServiceData[`ServicePrice${subIndex}`] =
          subService.price || "";
      });
    }
    // Build dynamic data for statusTracker.
    const dynamicStatusData: any = {};
    if (Array.isArray(customer.statusTracker)) {
      customer.statusTracker.forEach((status: any, index: number) => {
        const trackerIndex = index + 1;
        dynamicStatusData[`StatusTracker${trackerIndex}`] = status.status || "";
        const updatedByRole = status.updatedByCustomer
          ? "Customer"
          : status.updatedByPartner
            ? "Partner"
            : "";
        dynamicStatusData[`UpdatedBy${trackerIndex}(Role)`] = updatedByRole;
        const updatedByName =
          (status.updatedByCustomer && status.updatedByCustomer.name) ||
          (status.updatedByPartner && status.updatedByPartner.name) ||
          "";
        dynamicStatusData[`Name${trackerIndex}`] = updatedByName;
        // Club the date and time for the status createdAt.
        dynamicStatusData[`StatusCreatedAt${trackerIndex}`] = status.createdAt
          ? dayjs(status.createdAt).format("DD-MMM-YYYY hh:mm A")
          : "";
      });
    }

    // Build dynamic data for subservices.

    // Calculate total amount (sum of all subservice prices).
    let totalAmount = 0;
    if (Array.isArray(customer.subServiceIds)) {
      totalAmount = customer.subServiceIds.reduce(
        (sum: number, subService: any) => {
          return sum + (Number(subService.price) || 0);
        },
        0
      );
    }

    // Prepare the row data with clubbed date/time fields.
    const rowData = {
      ID: customer.bookingId,
      CreatedDateTime: dayjs(customer.createdAt).format("DD-MMM-YYYY hh:mm A"),
      BookingDateTime: dayjs(customer.bookedTime).format("DD-MMM-YYYY hh:mm A"),
      CustomerName: customer.customerId?.name || "",
      PartnerName: customer.partnerId?.name || "",
      BranchName: customer.serviceId?.name || "",
      Status: customer.status,
      TotalAmount: totalAmount,

      ...dynamicSubServiceData,
      ...dynamicStatusData,
    };

    sheet.addRow(rowData);
  });

  // Write the workbook to a buffer and trigger the download.
  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Bookings.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error generating Excel file:", error);
    });
};

export default bookingsExportExcel;
