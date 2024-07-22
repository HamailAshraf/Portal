import { useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { UserContext } from '../context/UserContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export const PieChart = () => {
  const [chart, setChart] = useState([]);
  const { token } = useContext(UserContext);

  const fetchData = async () => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await Axios.get('http://localhost:3000/users/completedshow', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChart(response.data);
    } catch (error) {
      console.log("Error fetching data: ", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (chart.length === 0) {
    return <div>Loading...</div>;
  }

  const totalTasks = chart.reduce((acc, user) => acc + user.completed_tasks, 0);

  const data = {
    labels: chart.map(user => user.name),
    datasets: [{
      label: `Completed Tasks`,
      data: chart.map(user => user.completed_tasks),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 14)',
        'rgba(54, 162, 235, 14)',
        'rgba(255, 206, 86, 14)',
        'rgba(75, 192, 192, 14)',
        'rgba(153, 102, 255, 14)',
        'rgba(255, 159, 64, 14)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          fontSize: 25,
        },
      },
      datalabels: {
        formatter: (value) => {
          const percentage = ((value / totalTasks) * 100).toFixed(2);
          if(percentage == 0) {
            return '';
            }
            else {
                return `${percentage}%`;
            }
        },
        color: '#fff',
        font: {
          weight: 'bold',
        }
      }
    }
  };

  return (
    <div>
      <Pie
        data={data}
        height={400}
        options={options}
      />
    </div>
  );
};
