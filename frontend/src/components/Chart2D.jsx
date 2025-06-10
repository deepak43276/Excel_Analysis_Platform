import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Chart2D({ type, data, xAxis, yAxis }) {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map(item => item[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: data.map(item => item[yAxis]),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${yAxis} vs ${xAxis}`
      }
    },
    scales: type !== 'pie' ? {
      y: {
        beginAtZero: true
      }
    } : undefined
  };

  const handleDownload = async () => {
    if (chartRef.current) {
      const dataUrl = await toPng(chartRef.current);
      const link = document.createElement('a');
      link.download = `chart-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (chartRef.current) {
      const dataUrl = await toPng(chartRef.current);
      const pdf = new jsPDF();
      pdf.addImage(dataUrl, 'PNG', 10, 10, 180, 100);
      pdf.save(`chart-${Date.now()}.pdf`);
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div ref={chartRef} className="h-[400px]">
        {renderChart()}
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Download Chart (PNG)
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Download Chart (PDF)
        </button>
      </div>
    </div>
  );
}
