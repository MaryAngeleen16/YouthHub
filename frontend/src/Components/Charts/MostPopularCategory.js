import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const MostPopularCategory = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4001/api/forums/categorize');
        setCategoryData(response.data.categorizeForums);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for chart
  const categories = categoryData.map(category => category.name);
  const topicCounts = categoryData.map(category => category.forums.length);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Number of Topics',
        backgroundColor: 'rgba(245, 40, 145, 0.8)',
        borderColor: 'rgba(213, 9, 114, 0.95)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: topicCounts,
      },
    ],
  };

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
          },
        },
      ],
    },
  };

  return (
    <div className="card">
      <div className="card-inner">
        <h5 className="card-title" style={{ color: "#b38269", fontSize: '16px' }}>Most Popular Category</h5>
      </div>
      <div className="card-body" style={{ padding: '10px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MostPopularCategory;
