import XLSX from 'xlsx';

export const parseExcelFile = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with headers
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Extract column headers
    const columns = Object.keys(data[0] || {});
    
    return {
      columns,
      data
    };
  } catch (error) {
    throw new Error('Failed to parse Excel file: ' + error.message);
  }
};