import dayjs from "dayjs";
import ExcelJS from "exceljs";

const partnerExportexcel = (data: any) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Users");
  sheet.getRow(1).font = {
    name: "Arial",
    family: 2,
    size: 12,
    bold: true,
  };
  sheet.properties.defaultRowHeight = 16;

  let columns = [
    { header: "Partner Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Mobile Number", key: "mobileNumber", width: 20 },
    { header: "Created At", key: "createdAtDate", width: 18 },
    { header: "Current Address", key: "currentAddress", width: 18 },
    { header: "Status", key: "status", width: 15 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.border = {
      ...cell.border,
      bottom: { style: "medium" }, // Thick bottom border under the header row
    };
  });

  // Determine max services and subservices dynamically
  const maxServices = Math.max(...data.map((p: any) => p.services.length), 0);
  const maxSubservicesPerService = data.reduce((acc: number[], p: any) => {
    p.services.forEach((s: any, i: number) => {
      acc[i] = Math.max(acc[i] || 0, s.service.subServiceIds?.length || 0);
    });
    return acc;
  }, []);

  for (let i = 0; i < maxServices; i++) {
    columns.push(
      {
        header: `Branch Name ${i + 1}`,
        key: `serviceName${i + 1}`,
        width: 25,
      },
      { header: `Category ${i + 1}`, key: `category${i + 1}`, width: 25 }
    );

    for (let j = 0; j < maxSubservicesPerService[i]; j++) {
      columns.push({
        header: `Service ${i + 1}.${j + 1}`,
        key: `subservice${i + 1}_${j + 1}`,
        width: 25,
      });
    }
  }

  // Determine max status tracker entries per partner
  const maxStatuses = Math.max(
    ...data.map((p: any) => (p.statusTracker ? p.statusTracker.length : 0)),
    0
  );

  for (let i = 0; i < maxStatuses; i++) {
    columns.push(
      { header: `Status ${i + 1}`, key: `status${i + 1}`, width: 20 },
      { header: `Updated By ${i + 1}`, key: `updatedBy${i + 1}`, width: 20 },
      { header: `Updated At ${i + 1}`, key: `updatedAt${i + 1}`, width: 20 }
    );
  }

  sheet.columns = columns;

  if (data && data.length) {
    data.forEach((customer: any) => {
      let rowData: any = {
        name: customer.name || "N/A",
        email: customer.email || "N/A",
        mobileNumber: customer.mobileNumber || "N/A",
        createdAtDate: dayjs(customer.createdAt).format("DD-MMM-YYYY hh:mm A"),
        currentAddress: customer.currentAddress,
        status: customer.status,
      };

      // Add service & subservice data
      customer.services.forEach((service: any, i: number) => {
        rowData[`serviceName${i + 1}`] = service.service.name || "N/A";
        rowData[`category${i + 1}`] = service.service.category?.name || "N/A";

        (service.service.subServiceIds || []).forEach((sub: any, j: number) => {
          rowData[`subservice${i + 1}_${j + 1}`] =
            sub?.subservice?.name || "N/A";
        });
      });

      // Add status tracker data
      customer.statusTracker?.forEach((statusEntry: any, i: number) => {
        rowData[`status${i + 1}`] = statusEntry.status || "N/A";
        rowData[`updatedBy${i + 1}`] = statusEntry.UpdatedBy?.name || "N/A";
        rowData[`updatedAt${i + 1}`] =
          dayjs(statusEntry.createdAt).format("DD-MMM-YYYY hh:mm A") || "N/A";
      });

      sheet.addRow(rowData);
    });
  }

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Partners.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
};

export default partnerExportexcel;
