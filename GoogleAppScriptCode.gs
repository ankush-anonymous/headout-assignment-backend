//to fetch data from the frontend
function doPost(e) {
  try {
    // Parse request data
    const requestData = JSON.parse(e.postData.contents);

    // Extract fields
    const integrationType = requestData.integrationType || "";
    const apiName = requestData.apiName || "";
    const bookingFlow = requestData.bookingFlow || "";
    const monthlyGBV = requestData.monthlyGBV || "";
    const businessPotential = requestData.businessPotential || "";
    const requester = requestData.requester || "";
    const date = requestData.date || "";
    const comments = requestData.comments || "";

    // Validate required fields
    if (!apiName || !integrationType) {
      throw new Error("API Name and Integration Type are required");
    }

    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(
      "18KciqH7pLy0zYaQwgs1QBnpFYZyidlDhR6sE5nNQq6U"
    );
    const rawDataSheet = sheet.getSheetByName("rawdata");
    const dashboardSheet = sheet.getSheetByName("Dashboard");

    // Prepare data for Raw Data
    const rowData = [
      integrationType,
      apiName,
      bookingFlow,
      monthlyGBV,
      businessPotential,
      requester,
      date,
      comments,
    ];

    // Append data to Raw Data sheet
    rawDataSheet.appendRow(rowData);
    Logger.log("Data appended to Raw Data successfully.");

    // Prepare data for Dashboard
    const dashboardData = [
      new Date(), // Requested Date
      apiName, // API Name
      integrationType, // Type of the Integration
      monthlyGBV, // Actual/Estimated Monthly GBV
      "Requested", // Status
    ];

    // Append data to Dashboard
    dashboardSheet.appendRow(dashboardData);
    Logger.log("Data appended to Dashboard successfully.");

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        status: "success",
        message: "Data added and copied to dashboard successfully",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Log error and return failure response
    Logger.log("Error: " + error.message);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

//on editing records in dashboard
function onEdit(e) {
  // Get the active sheet and the edited range
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Check if the active sheet is "Dashboard"
  if (sheet.getName() !== "Dashboard") return;

  const row = range.getRow(); // Row of the edited cell
  const col = range.getColumn(); // Column of the edited cell

  // Columns: F = 6 (Planned Start Date), G = 7 (Dev Live Date), H = 8 (Actual Start Date), I = 9 (Actual Live Date), J = 10 (Days in Current Status)

  // Task 2: Planned Start Date (Column F)
  if (col === 6) {
    const plannedStartDate = range.getValue();

    // Log the planned start date
    Logger.log("Planned Start Date: " + plannedStartDate);

    // If the Planned Start Date is cleared, reset status to "Requested"
    if (!plannedStartDate) {
      sheet.getRange(row, 5).setValue("Requested"); // Reset Status (Column E)
      return;
    }

    // Format the date to MM/dd/yy for validation
    const formattedDate = formatDateToMMddyy(plannedStartDate);
    Logger.log("Formatted Date: " + formattedDate);

    // Check if the value in Column F is a valid date in MM/dd/yy format
    if (!isValidDateInFormat(formattedDate, "MM/dd/yy")) {
      Logger.log("Invalid date format: " + formattedDate);
      return;
    }

    // Ensure Columns A, B, C, and D are filled
    const rowData = sheet.getRange(row, 1, 1, 4).getValues()[0]; // Values in Columns A, B, C, D
    if (rowData.some((value) => !value)) {
      Logger.log("Columns A, B, C, or D are not filled.");
      return;
    }

    // Ensure Columns G, H, I, and J are empty
    const statusCheckData = sheet.getRange(row, 7, 1, 4).getValues()[0]; // Values in Columns G, H, I, J
    if (statusCheckData.some((value) => value)) {
      Logger.log("Columns G, H, I, or J are not empty.");
      return;
    }

    // Update Status column (E = 5) to "Added to Pipeline"
    sheet.getRange(row, 5).setValue("Added to Pipeline");
    Logger.log('Status updated to "Added to Pipeline".');
  }

  // Task 3 & 4: Status changes (Column E)
  if (col === 5) {
    const status = range.getValue();
    const currentDateTime = new Date();

    if (status === "Dev Started") {
      sheet.getRange(row, 8).setValue(formatDateTime(currentDateTime)); // Set Actual Start Date (Column H)
      Logger.log(
        "Actual Start Date set to: " + formatDateTime(currentDateTime)
      );
    } else if (status === "Live") {
      sheet.getRange(row, 9).setValue(formatDateTime(currentDateTime)); // Set Actual Live Date (Column I)
      Logger.log("Actual Live Date set to: " + formatDateTime(currentDateTime));
    }
  }
}

// Helper function to check if a value is a valid date in the specified format
function isValidDateInFormat(value, format) {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2})$/; // Regex for MM/dd/yy format
  const match = value.toString().match(dateRegex);

  if (!match) return false; // Invalid format

  const month = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Adjust year to 4-digit format
  const fullYear = year < 50 ? 2000 + year : 1900 + year;

  // Validate the date components
  const isValid =
    month > 0 && month <= 12 && day > 0 && day <= 31 && fullYear > 0;
  Logger.log("Date validation result: " + isValid);
  return isValid;
}

// Helper function to format date and time as "MM/dd/yy HH:mm:ss"
function formatDateTime(date) {
  return Utilities.formatDate(
    date,
    Session.getScriptTimeZone(),
    "MM/dd/yy HH:mm:ss"
  );
}

// Helper function to format date to MM/dd/yy
function formatDateToMMddyy(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "MM/dd/yy");
}
