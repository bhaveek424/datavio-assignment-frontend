// Helper function to calculate the average value and time of a dataset
export const calculateAverage = (dataset) => {
  if (dataset.length === 0) {
    return { value: 0, time: 0 };
  }

  const totalValue = dataset.reduce((total, item) => total + item[1], 0);
  const totalTime = dataset.reduce((total, item) => total + item[0], 0);

  return {
    value: totalValue / dataset.length,
    time: totalTime / dataset.length,
  };
};

// Helper function to calculate the median value and time of a dataset
export const calculateMedian = (dataset) => {
  if (dataset.length === 0) {
    return { value: 0, time: 0 };
  }

  const values = dataset.map((item) => item[1]);
  const times = dataset.map((item) => item[0]);

  values.sort((a, b) => a - b);
  times.sort((a, b) => a - b);

  const middleValue = values[Math.floor(values.length / 2)];
  const middleTime = times[Math.floor(times.length / 2)];

  return { value: middleValue, time: middleTime };
};

// Helper function to calculate the total average (both value and time) across all categories
export const calculateTotalAverage = (data) => {
  const allData = data.category1.concat(data.category2, data.category3);

  if (allData.length === 0) {
    return { value: 0, time: 0 };
  }

  const totalValue = allData.reduce((total, item) => total + item[1], 0);
  const totalTime = allData.reduce((total, item) => total + item[0], 0);

  return {
    value: totalValue / allData.length,
    time: totalTime / allData.length,
  };
};
