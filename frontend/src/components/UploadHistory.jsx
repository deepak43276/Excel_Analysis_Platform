import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUploads, getUploadById } from '../redux/uploadSlice';
import { DocumentIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function UploadHistory({ refresh }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uploads, loading } = useSelector((state) => state.upload);

  useEffect(() => {
    dispatch(fetchUploads());
  }, [dispatch, refresh]);

  const handleViewChart = async (id) => {
    try {
      const upload = await dispatch(getUploadById(id)).unwrap();
      
      if (!upload.analysisResults?.data || !upload.analysisResults?.columns) {
        console.error('No data available for this upload');
        return;
      }

      // Extract column names
      const columns = upload.analysisResults.columns.map(col => 
        typeof col === 'object' ? col.name : col
      );

      // Navigate to chart view with data
      navigate('/chart', { 
        state: { 
          columns,
          data: upload.analysisResults.data,
          uploadId: upload._id,
          fileName: upload.originalName
        }
      });
    } catch (error) {
      console.error('Error fetching upload:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Upload History</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {uploads.map((upload) => (
            <li key={upload._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentIcon className="h-6 w-6 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{upload.originalName}</p>
                    <p className="text-sm text-gray-500">
                      {upload.createdAt && !isNaN(new Date(upload.createdAt))
                        ? `Uploaded on ${new Date(upload.createdAt).toLocaleDateString()}`
                        : 'Upload date not available'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {upload.status}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleViewChart(upload._id)}
                  disabled={upload.status !== 'completed'}
                  className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md ${
                    upload.status === 'completed' 
                      ? 'bg-indigo-600 hover:bg-indigo-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ChartBarIcon className="h-5 w-5 mr-2" />
                  View Charts
                </button>
              </div>
            </li>
          ))}
          {uploads.length === 0 && (
            <li className="px-4 py-4 text-center text-gray-500">
              No files uploaded yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
