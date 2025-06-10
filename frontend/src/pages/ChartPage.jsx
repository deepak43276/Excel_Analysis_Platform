import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChartSelector from '../components/ChartSelector';
import Chart2D from '../components/Chart2D';
import Chart3DPlotly from '../components/Chart3DPlotly';

export default function ChartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { columns, data, uploadId, fileName } = location.state || {};

  const [chartConfig, setChartConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validate data on component mount
    if (!columns || !data || columns.length === 0 || data.length === 0) {
      setError('No data available for this upload. Please try uploading the file again.');
    }
  }, [columns, data]);

  const handleChartSelect = (config) => {
    setChartConfig(config);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Chart View: {fileName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Select chart type and axes to visualize your data
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ChartSelector
              columns={columns}
              onSelect={handleChartSelect}
              data={data}
            />
          </div>
          <div className="md:col-span-2">
            {chartConfig ? (
              chartConfig.chartType === '3d-column' ? (
                <Chart3DPlotly
                  data={data}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                  zAxis={chartConfig.zAxis}
                />
              ) : chartConfig.chartType === '3d-scatter' ? (
                <Chart3DPlotly
                  data={data}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                  zAxis={chartConfig.zAxis}
                />
              ) : (
                <Chart2D
                  type={chartConfig.chartType}
                  data={data}
                  xAxis={chartConfig.xAxis}
                  yAxis={chartConfig.yAxis}
                />
              )
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                Select chart type and axes to generate visualization
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
