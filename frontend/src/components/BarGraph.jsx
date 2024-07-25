import { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { UserContext } from '../context/UserContext';


ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels);

export const BarGraph = () => {
  const [chart, setChart] = useState([]);
  const [startDate, setStartDate] = useState('2024-07-24');
  const [endDate, setEndDate] = useState('2024-07-24');
  const { token } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await Axios.get('http://localhost:3000/users/completedcount', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate
        }
      });
      if (response.data.status === "success") {
        setChart(response.data.data); 
      } else {
        console.error("Error in response data: ", response.data.message);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chart || chart.length === 0) {
    return <div>No data available</div>;
  }

  const data = {
    labels: chart.map(user => user.name), 
    datasets: [{
      label: 'Completed Tasks',
      data: chart.map(user => user.completed_tasks_count), 
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
      datalabels: {
        formatter: (value) => {
          return value; 
        },
        color: '#fff',
        font: {
          weight: 'bold',
        }
      }
    }
  };

  return (
    <div className='bg-blue-100 h-screen flex items-center justify-center'>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-sm font-medium mb-2">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-sm font-medium mb-2">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Fetch Data
        </button>
      </div>
      <div className='w-full max-w-4xl'>
        <Bar
          data={data}
          height={400}
          options={options}
        />
      </div>
    </div>
  );
};