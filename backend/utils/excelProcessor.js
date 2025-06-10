import xlsx from 'xlsx';
import fs from 'fs/promises';

export const processExcelFile = async (filePath, analysisType) => {
  try {
    console.log('Starting Excel file processing for:', filePath);
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);
    console.log('Workbook read successfully.');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log('Worksheet obtained.');
    const data = xlsx.utils.sheet_to_json(worksheet);
    console.log(`Converted sheet to JSON. ${data.length} rows found.`);

    if (!data.length) {
      console.log('No data found in worksheet.');
      // Instead of throwing an error here, return an empty analysis result
      // This allows the upload record to still be marked as completed, but with empty results
      return { data: [], columns: [], analysis: { error: 'No data found in the file' } };
    }

    // Get column information
    const columns = Object.keys(data[0] || {}).map(col => ({
      name: col,
      type: typeof data[0][col]
    }));
    console.log('Columns identified:', columns.map(c => c.name));

    // Perform analysis based on type
    console.log('Performing analysis for type:', analysisType);
    const results = {
      basic: await performBasicAnalysis(data),
      advanced: await performAdvancedAnalysis(data),
      custom: await performCustomAnalysis(data)
    }[analysisType];
    console.log('Analysis results generated.');

    // Ensure data is included in results
    const finalResults = {
      ...results,
      columns,
      data // Always include the raw data
    };
    console.log('Final results prepared.');

    // Clean up the file - this should ideally be handled by the caller (uploadController.js)
    // but keeping it here for now as per existing logic, with a console log for clarity
    try {
      await fs.unlink(filePath);
      console.log('Temporary file deleted successfully.');
    } catch (unlinkError) {
      console.error('Error deleting temporary file:', unlinkError);
    }

    return finalResults;
  } catch (error) {
    console.error('Error during Excel file processing:', error);
    // Re-throw the error so the caller can catch and handle it (e.g., set upload status to failed)
    throw error;
  }
};

const performBasicAnalysis = async (data) => {
  if (!data.length) {
    return { error: 'No data found in the file' };
  }

  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => 
    typeof data[0][col] === 'number' || !isNaN(Number(data[0][col]))
  );

  const analysis = {
    totalRows: data.length,
    columns: columns.map(col => ({
      name: col,
      type: typeof data[0][col],
      uniqueValues: new Set(data.map(row => row[col])).size
    }))
  };

  // Add numeric statistics if numeric columns exist
  if (numericColumns.length) {
    analysis.numericStats = numericColumns.map(col => {
      const values = data.map(row => Number(row[col])).filter(v => !isNaN(v));
      return {
        column: col,
        min: Math.min(...values),
        max: Math.max(...values),
        sum: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length
      };
    });
  }

  return { ...analysis, data };
};

const performAdvancedAnalysis = async (data) => {
  const basicAnalysis = await performBasicAnalysis(data);
  
  // Add correlation analysis for numeric columns
  if (basicAnalysis.numericStats) {
    const numericColumns = basicAnalysis.numericStats.map(stat => stat.column);
    const correlations = [];

    for (let i = 0; i < numericColumns.length; i++) {
      for (let j = i + 1; j < numericColumns.length; j++) {
        const col1 = numericColumns[i];
        const col2 = numericColumns[j];
        
        const values1 = data.map(row => Number(row[col1])).filter(v => !isNaN(v));
        const values2 = data.map(row => Number(row[col2])).filter(v => !isNaN(v));
        
        const correlation = calculateCorrelation(values1, values2);
        correlations.push({
          columns: [col1, col2],
          correlation
        });
      }
    }

    basicAnalysis.correlations = correlations;
  }

  return { ...basicAnalysis, data };
};

const performCustomAnalysis = async (data) => {
  const advancedAnalysis = await performAdvancedAnalysis(data);
  
  // Add trend analysis
  if (advancedAnalysis.numericStats) {
    const trends = advancedAnalysis.numericStats.map(stat => {
      const values = data.map(row => Number(row[stat.column])).filter(v => !isNaN(v));
      return {
        column: stat.column,
        trend: calculateTrend(values)
      };
    });

    advancedAnalysis.trends = trends;
  }

  return { ...advancedAnalysis, data };
};

const calculateCorrelation = (x, y) => {
  const n = Math.min(x.length, y.length);
  if (n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

const calculateTrend = (values) => {
  const n = values.length;
  if (n < 2) return 'insufficient data';

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += Math.pow(i - xMean, 2);
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;

  if (Math.abs(slope) < 0.1) return 'stable';
  return slope > 0 ? 'increasing' : 'decreasing';
}; 