import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Line } from 'react-chartjs-2';
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
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios.get(
          'http://localhost:3000/data/category1',
        );
        const response2 = await axios.get(
          'http://localhost:3000/data/category2',
        );
        const response3 = await axios.get(
          'http://localhost:3000/data/category3',
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

  useEffect(() => {
    // Update chart data based on the selected category
    let chartDataForSelectedCategory = [];

    if (selectedCategory === 'All Categories') {
      // Combine data for all categories
      chartDataForSelectedCategory = data.category1.concat(
        data.category2,
        data.category3,
      );
    } else if (data[selectedCategory]) {
      // Use data for the selected category
      chartDataForSelectedCategory = data[selectedCategory];
    } else {
      // Handle the case when selectedCategory is not found in data
      chartDataForSelectedCategory = [];
    }

    // Render the new chart if data is available
    if (chartDataForSelectedCategory.length > 0) {
      // You can update your chart here using chartDataForSelectedCategory
    }

    // Implement any additional logic or calculations as needed
  }, [selectedCategory, data]);
  // Implement functions to calculate aggregate values (average and median)

  // Define chart options and data based on selectedCategory and aggregate values

  return (
    <div>
      <h1>Your Line Chart</h1>
      <Select
        defaultValue="All Categories"
        style={{ width: 200 }}
        onChange={(value) => setSelectedCategory(value)}>
        <Option value="All Categories">All Categories</Option>
        <Option value="category1">Category 1</Option>
        <Option value="category2">Category 2</Option>
        <Option value="category3">Category 3</Option>
      </Select>
      <div>
        {/* Conditional rendering: Render the Line chart if data is available */}
        {!loading && (
          <Line
            data={{
              labels:
                selectedCategory === 'All Categories'
                  ? data.category1.map((item) => item[0])
                  : data[selectedCategory].map((item) => item[0]), // Use timestamps as labels
              datasets:
                selectedCategory === 'All Categories'
                  ? [
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
                    ]
                  : [
                      {
                        label: selectedCategory,
                        data: data[selectedCategory].map((item) => item[1]),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },
                    ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Chart.js Line Chart',
                },
              },
            }}
          />
        )}
        {loading && <p>Loading data...</p>}
        {!loading && !data && <p>No data available.</p>}
      </div>
    </div>
  );
};

export default App;
