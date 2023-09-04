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
import faker from 'faker';
import {
  calculateAverage,
  calculateAverageTime,
  calculateMedian,
  calculateMedianTime,
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

export const fakerOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const fakerData = {
  datasets: [
    {
      label: 'Red dataset',
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Blue dataset',
      data: Array.from({ length: 50 }, () => ({
        x: faker.datatype.number({ min: -100, max: 100 }),
        y: faker.datatype.number({ min: -100, max: 100 }),
        r: faker.datatype.number({ min: 5, max: 20 }),
      })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const App = () => {
  const [data, setData] = useState({
    category1: [],
    category2: [],
    category3: [],
  });
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);
  const [bubbleData, setBubbleData] = useState([]);

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
    let chartDataForSelectedCategory = [];

    if (selectedCategory === 'All Categories') {
      chartDataForSelectedCategory = data.category1.concat(
        data.category2,
        data.category3,
      );
    } else if (data[selectedCategory]) {
      chartDataForSelectedCategory = data[selectedCategory];
    } else {
      chartDataForSelectedCategory = [];
    }

    if (chartDataForSelectedCategory.length > 0) {
      //
    }
  }, [selectedCategory, data]);

  useEffect(() => {
    let updatedBubbleData = [];

    if (selectedCategory === 'All Categories') {
      const category1Average = calculateAverage(data.category1);
      const category1Median = calculateMedian(data.category1);

      const category2Average = calculateAverage(data.category2);
      const category2Median = calculateMedian(data.category2);

      const category3Average = calculateAverage(data.category3);
      const category3Median = calculateMedian(data.category3);

      const overallAverage =
        (category1Average + category2Average + category3Average) / 3;
      const overallTimeAverage =
        (calculateAverageTime(data.category1) +
          calculateAverageTime(data.category2) +
          calculateAverageTime(data.category3)) /
        3;

      updatedBubbleData = [
        { x: category1Average, y: calculateAverageTime(data.category1), r: 10 },
        { x: category1Median.value, y: category1Median.time, r: 10 },
        { x: category2Average, y: calculateAverageTime(data.category2), r: 10 },
        { x: category2Median.value, y: category2Median.time, r: 10 },
        { x: category3Average, y: calculateAverageTime(data.category3), r: 10 },
        { x: category3Median.value, y: category3Median.time, r: 10 },
        { x: overallAverage, y: overallTimeAverage, r: 10 },
      ];
    } else if (data[selectedCategory]) {
      const selectedCategoryData = data[selectedCategory];
      const selectedCategoryAverage = calculateAverage(selectedCategoryData);
      const selectedCategoryMedian = calculateMedian(selectedCategoryData);

      updatedBubbleData = [
        {
          x: selectedCategoryAverage,
          y: calculateAverageTime(selectedCategoryData),
          r: 10,
        },
        {
          x: selectedCategoryMedian.value,
          y: selectedCategoryMedian.time,
          r: 10,
        },
      ];
    }

    setBubbleData(updatedBubbleData);
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
                },
              }}
            />
          </div>
        )}
        {loading && <p>Loading data...</p>}
        {!loading && !data && <p>No data available.</p>}
        <div style={{ width: '40vw', flex: 1 }}>
          <Bubble
            options={fakerOptions}
            data={{ datasets: [{ data: bubbleData }] }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
