import { useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ChartSelector({ columns, onSelect, data }) {
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [zAxis, setZAxis] = useState('');

  const chartCategories = {
    '2D Charts': [
      { id: 'bar', name: 'Bar Chart' },
      { id: 'line', name: 'Line Chart' },
      { id: 'pie', name: 'Pie Chart' },
      { id: 'scatter', name: 'Scatter Plot' }
    ],
    '3D Charts': [
      { id: '3d-column', name: '3D Column' },
      { id: '3d-scatter', name: '3D Scatter' }
    ],
    'Analysis': [
      { id: 'summary', name: 'Data Summary' },
      { id: 'correlation', name: 'Correlation Analysis' },
      { id: 'ai-insights', name: 'AI Insights' }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSelect({ chartType, xAxis, yAxis, zAxis });
  };

  const generateDataSummary = () => {
    if (!yAxis || !data.length) return null;

    const values = data.map(item => parseFloat(item[yAxis])).filter(val => !isNaN(val));
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return {
      count: values.length,
      sum: sum.toFixed(2),
      average: avg.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2)
    };
  };

  return (
    <div className="w-full px-2 py-8 sm:py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {Object.keys(chartCategories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(chartCategories).map((charts, idx) => (
            <Tab.Panel
              key={idx}
              className="rounded-xl bg-white p-2 sm:p-3"
            >
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  {charts.map((chart) => (
                    <button
                      key={chart.id}
                      onClick={() => {
                        setChartType(chart.id);
                        if (!chart.id.startsWith('3d-')) {
                          setZAxis(''); // Clear zAxis if not a 3D chart
                        }
                      }}
                      className={classNames(
                        'p-2 sm:p-4 rounded-lg text-left text-xs sm:text-sm',
                        chartType === chart.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                    >
                      {chart.name}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">X Axis</label>
                    <select
                      value={xAxis}
                      onChange={(e) => setXAxis(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                    >
                      <option value="">Select X Axis</option>
                      {columns.map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Y Axis</label>
                    <select
                      value={yAxis}
                      onChange={(e) => setYAxis(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                    >
                      <option value="">Select Y Axis</option>
                      {columns.map(column => (
                        <option key={column} value={column}>{column}</option>
                      ))}
                    </select>
                  </div>

                  {(chartType === '3d-column' || chartType === '3d-scatter') && (
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700">Z Axis</label>
                      <select
                        value={zAxis}
                        onChange={(e) => setZAxis(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm"
                      >
                        <option value="">Select Z Axis</option>
                        {columns.map(column => (
                          <option key={column} value={column}>{column}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {chartType === 'summary' && yAxis && (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h3 className="text-base sm:text-lg font-medium mb-2">Data Summary</h3>
                      {generateDataSummary() && (
                        <dl className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div>
                            <dt className="text-xs sm:text-sm text-gray-500">Count</dt>
                            <dd className="text-sm sm:text-lg font-medium">{generateDataSummary().count}</dd>
                          </div>
                          <div>
                            <dt className="text-xs sm:text-sm text-gray-500">Sum</dt>
                            <dd className="text-sm sm:text-lg font-medium">{generateDataSummary().sum}</dd>
                          </div>
                          <div>
                            <dt className="text-xs sm:text-sm text-gray-500">Average</dt>
                            <dd className="text-sm sm:text-lg font-medium">{generateDataSummary().average}</dd>
                          </div>
                          <div>
                            <dt className="text-xs sm:text-sm text-gray-500">Range</dt>
                            <dd className="text-sm sm:text-lg font-medium">
                              {generateDataSummary().min} - {generateDataSummary().max}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={(!xAxis || !yAxis) || ((chartType === '3d-column' || chartType === '3d-scatter') && !zAxis)}
                    className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    Generate Visualization
                  </button>
                </div>
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
