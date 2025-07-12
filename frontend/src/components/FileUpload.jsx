import React, { useState, useRef, useEffect } from 'react';
import { FileUp } from "lucide-react";
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../redux/uploadSlice';
import Chart3DPlotly from './Chart3DPlotly';
import ChartSelector from './ChartSelector';
import Chart2D from './Chart2D';

export default function FileUpload({ onUploadSuccess }) {
  const [excelData, setExcelData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [chartConfig, setChartConfig] = useState(null);
  const chartRef = useRef(null);
  const dispatch = useDispatch();

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData.length) {
        toast.error("Excel file is empty or unreadable.");
        return;
      }

      const columns = Object.keys(jsonData[0]);
      setHeaders(columns);
      setExcelData(jsonData);
      setChartConfig(null); // Reset chart config on new file upload
      toast.success("File uploaded successfully!");

      if (chartRef.current) {
        chartRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadFileFn = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await dispatch(uploadFile(formData)).unwrap();
      // No toast here, as parseExcel already shows success if file is valid
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload file failed");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      parseExcel(file);
      uploadFileFn(file);
    } else {
      toast.error("Please upload a valid .xlsx file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      parseExcel(file);
      uploadFileFn(file);
    } else {
      toast.error("Please upload a valid .xlsx file");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100 text-gray-800 px-4 sm:px-6">
        <div className="w-full lg:w-1/2 text-center space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Upload Your Excel File</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">Start analyzing your data by uploading an Excel spreadsheet.</p>
        </div>

        <div
          className="w-full lg:w-1/2 mt-6 lg:mt-0 flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-white shadow-lg"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <label className="flex flex-col items-center cursor-pointer">
            <FileUp className='text-green-500 h-12 w-12 sm:h-16 sm:w-16 lg:h-18 lg:w-18' />
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center">Drag and drop a file here, or click to select a file</p>
          </label>
        </div>
      </div>

      {excelData.length > 0 && (
        <div ref={chartRef} className="mt-6 sm:mt-8 px-4 sm:px-6 py-6 sm:py-8 bg-white shadow rounded-lg">
          <ChartSelector
            columns={headers}
            onSelect={setChartConfig}
            data={excelData}
          />
          {chartConfig ? (
            chartConfig.chartType.startsWith('3d-') ? (
              <Chart3DPlotly
                data={excelData}
                xAxis={chartConfig.xAxis}
                yAxis={chartConfig.yAxis}
                zAxis={chartConfig.zAxis}
              />
            ) : (
              <Chart2D
                type={chartConfig.chartType}
                data={excelData}
                xAxis={chartConfig.xAxis}
                yAxis={chartConfig.yAxis}
              />
            )
          ) : (
            <div className="text-center text-gray-500 mt-4 text-sm sm:text-base">
              Select chart type and axes to generate visualization
            </div>
          )}
        </div>
      )}
    </div>
  );
}
