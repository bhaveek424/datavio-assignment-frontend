import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Bubble, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  calculateAverage,
  calculateMedian,
  calculateTotalAverage,
} from './utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const { Option } = Select;

const App = () => {
  const [data, setData] = useState({
    category1: [],
    category2: [],
    category3: [],
  });
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [bubbleData, setBubbleData] = useState(null);

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          'https://i8tsc6o7w5.api.quickmocker.com/data/category1',
        );
        const response2 = await axios.get(
          'https://i8tsc6o7w5.api.quickmocker.com/data/category2',
        );
        const response3 = await axios.get(
          'https://i8tsc6o7w5.api.quickmocker.com/data/category3',
        );

        setData({
          category1: response1.data.data,
          category2: response2.data.data,
          category3: response3.data.data,
        });

        console.log('Data fetched:', response1.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Line Chart
  useEffect(() => {
    let chartDataForSelectedCategory = [];

    if (selectedCategory === 'All Categories') {
      // Create datasets for all three categories
      const datasets = [
        {
          label: 'Category 1',
          data: data.category1.map((item) => item[1]),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Category 2',
          data: data.category2.map((item) => item[1]),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Category 3',
          data: data.category3.map((item) => item[1]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ];

      const labels = data.category1.map((item) => item[0]);

      chartDataForSelectedCategory = { labels, datasets };
    } else if (data[selectedCategory]) {
      const dataset = {
        label: selectedCategory,
        data: data[selectedCategory].map((item) => item[1]),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      };

      const labels = data[selectedCategory].map((item) => item[0]);

      chartDataForSelectedCategory = { labels, datasets: [dataset] };
    } else {
      chartDataForSelectedCategory = null;
    }

    setChartData(chartDataForSelectedCategory);
  }, [selectedCategory, data]);

  // bubble chart
  useEffect(() => {
    let chartDataForSelectedCategory = [];

    const averageCat1 = calculateAverage(data.category1);
    const medianCat1 = calculateMedian(data.category1);
    const averageCat2 = calculateAverage(data.category2);
    const medianCat2 = calculateMedian(data.category2);
    const averageCat3 = calculateAverage(data.category3);
    const medianCat3 = calculateMedian(data.category3);
    const totalAverage = calculateTotalAverage(data);

    if (selectedCategory === 'All Categories') {
      // Create datasets for all three categories
      const datasets = [
        {
          label: 'Cat 1(A)',
          data: Array.from({ length: 1 }, () => ({
            x: averageCat1.time,
            y: averageCat1.value,
            r: 10,
          })),
          backgroundColor: 'rgba(32, 121, 137, 0.5)',
        },
        {
          label: 'Cat 1(M)',
          data: Array.from({ length: 1 }, () => ({
            x: medianCat1.time,
            y: medianCat1.value,
            r: 10,
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Cat 2(A)',
          data: Array.from({ length: 1 }, () => ({
            x: averageCat2.time,
            y: averageCat2.value,
            r: 10,
          })),
          backgroundColor: 'rgba(86, 46, 55, 0.5)',
        },
        {
          label: 'Cat 2(M)',
          data: Array.from({ length: 1 }, () => ({
            x: medianCat2.time,
            y: medianCat2.value,
            r: 10,
          })),
          backgroundColor: 'rgba(35, 62, 94, 0.5)',
        },
        {
          label: 'Cat 3(A)',
          data: Array.from({ length: 1 }, () => ({
            x: averageCat3.time,
            y: averageCat3.value,
            r: 10,
          })),
          backgroundColor: 'rgba(55, 48, 50, 0.5)',
        },
        {
          label: 'Cat 3(M)',
          data: Array.from({ length: 1 }, () => ({
            x: medianCat3.time,
            y: medianCat3.value,
            r: 10,
          })),
          backgroundColor: 'rgba(124, 40, 176, 0.5)',
        },
        {
          label: 'Total(A)',
          data: Array.from({ length: 1 }, () => ({
            x: totalAverage.time,
            y: totalAverage.value,
            r: 10,
          })),
          backgroundColor: 'rgba(119, 212, 127, 0.5)',
        },
      ];

      const labels = data.category1.map((item) => item[0]);

      chartDataForSelectedCategory = { labels, datasets };
    } else if (data[selectedCategory]) {
      const selectedCategoryData = data[selectedCategory];
      const selectedCategoryAverage = calculateAverage(selectedCategoryData);
      const selectedCategoryMedian = calculateMedian(selectedCategoryData);
      const datasets = [
        {
          label: `${selectedCategory}(A)`,
          data: Array.from({ length: 1 }, () => ({
            x: selectedCategoryAverage.time,
            y: selectedCategoryAverage.value,
            r: 10,
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: `${selectedCategory}(M)`,
          data: Array.from({ length: 1 }, () => ({
            x: selectedCategoryMedian.time,
            y: selectedCategoryMedian.value,
            r: 10,
          })),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ];

      const labels = data[selectedCategory].map((item) => item[0]);
      chartDataForSelectedCategory = { labels, datasets };
    }

    setBubbleData(chartDataForSelectedCategory);
  }, [selectedCategory, data]);

  return (
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <div
        style={{
          borderStyle: 'solid',
          maxWidth: '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <h1 style={{ paddingLeft: 20 }}>Welcome Test User!</h1>
        <p style={{ paddingLeft: 20 }}>Check category data below</p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
        }}>
        <h3 style={{ paddingLeft: '40px' }}>Select category data</h3>
        <Select
          defaultValue="All Categories"
          style={{ width: 200 }}
          onChange={(value) => setSelectedCategory(value)}>
          <Option value="All Categories">All Categories</Option>
          <Option value="category1">Category 1</Option>
          <Option value="category2">Category 2</Option>
          <Option value="category3">Category 3</Option>
        </Select>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          width: '100vw',
        }}>
        {/* Conditional rendering: Render the Line chart if data is available */}
        {!loading && (
          <div style={{ flex: 1, width: '40vw' }}>
            {chartData ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            ) : (
              <p>No data available for the selected category.</p>
            )}
          </div>
        )}
        {loading && <p>Loading data...</p>}
        {!loading && !data && <p>No data available.</p>}
        {bubbleData ? (
          <div style={{ width: '40vw', flex: 1, paddingRight: '20px' }}>
            <Bubble
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
              data={bubbleData}
            />
          </div>
        ) : (
          <p>No data available for the selected category.</p>
        )}
      </div>
    </div>
  );
};

export default App;
