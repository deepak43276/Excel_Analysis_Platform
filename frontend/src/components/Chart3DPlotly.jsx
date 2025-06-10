import { useState, useRef, useEffect } from 'react';
import Plot from 'react-plotly.js';
import toast from 'react-hot-toast';

export default function Chart3DPlotly({ data = [], xAxis = '', yAxis = '', zAxis = '' }) {
  const [xCol, setXCol] = useState(xAxis);
  const [yCol, setYCol] = useState(yAxis);
  const [zCol, setZCol] = useState(zAxis);
  const chartRef = useRef(null);

  const generate3DBars = () => {
    if (!xCol || !yCol || !zCol || data.length === 0) return null;
  
    const bars = data.flatMap((row) => {
      const x = row[xCol];
      const y = row[yCol];
      const z = row[zCol];
  
      return [{
        type: 'scatter3d',
        mode: 'lines',
        x: [x, x],
        y: [y, y],
        z: [0, z],
        line: {
          width: 10,
          color: z,
          colorscale: 'Viridis'
        },
        showlegend: false
      }];
    });
  
    return (
      <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
        <Plot
          data={bars}
          layout={{
            title: '3D Bar Graph',
            autosize: true,
            margin: { l: 0, r: 0, b: 0, t: 50 },
            scene: {
              xaxis: { 
                title: xCol,
                showgrid: true,
                zeroline: true
              },
              yaxis: { 
                title: yCol,
                showgrid: true,
                zeroline: true
              },
              zaxis: { 
                title: zCol,
                showgrid: true,
                zeroline: true
              },
              camera: {
                eye: { x: 1.5, y: 1.5, z: 1.5 }
              }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
          config={{ 
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToAdd: ['downloadImage'],
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
          }}
        />
      </div>
    );
  };

  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (xCol && yCol && zCol && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [xCol, yCol, zCol]);

  return (
    <div className="p-4 bg-gray-200 space-y-4" ref={chartRef}>
      <h1 className='text-lg lg:text-4xl font-semibold text-center'>3D Chart</h1>
      <div className='mx-auto space-y-4'>
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 gap-4">
          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-semibold">Select X-Axis</label>
            <select 
              value={xCol} 
              onChange={(e) => setXCol(e.target.value)} 
              className="border p-2 rounded w-full"
            >
              <option value="">Select X Axis</option>
              {headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-semibold">Select Y-Axis</label>
            <select 
              value={yCol} 
              onChange={(e) => setYCol(e.target.value)} 
              className="border p-2 rounded w-full"
            >
              <option value="">Select Y Axis</option>
              {headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block mb-1 font-semibold">Select Z-Axis</label>
            <select 
              value={zCol} 
              onChange={(e) => setZCol(e.target.value)} 
              className="border p-2 rounded w-full"
            >
              <option value="">Select Z Axis (Height)</option>
              {headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-4 shadow rounded-lg">
        {xCol && yCol && zCol ? generate3DBars() : <p>Select X, Y and Z axes to render the chart.</p>}
      </div>
    </div>
  );
} 