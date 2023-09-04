export const calculateAverage = (values) => {
  const sum = values.reduce((acc, val) => acc + val[1], 0);
  return sum / values.length;
};

export function calculateMedian(data) {
  const sortedData = [...data].sort((a, b) => a[1] - b[1]);
  const middle = Math.floor(sortedData.length / 2);

  if (sortedData.length === 0) {
    return { value: null, time: null };
  }

  if (sortedData.length % 2 === 0) {
    if (middle > 0) {
      const medianValue =
        (sortedData[middle - 1][1] + sortedData[middle][1]) / 2;
      let medianTime = null;

      // Loop through the sorted data to find the data point with the median value
      for (let i = 0; i < sortedData.length; i++) {
        if (sortedData[i][1] === medianValue) {
          medianTime = sortedData[i][0];
          break; // Found the data point, exit the loop
        }
      }

      return { value: medianValue, time: medianTime };
    } else {
      // Handle the case where there is not enough data for a median
      return { value: null, time: null };
    }
  } else {
    const medianValue = sortedData[middle][1];
    const medianTime = sortedData[middle][0];
    return { value: medianValue, time: medianTime };
  }
}

export function calculateMedianTime(data, medianValue) {
  const matchingData = data.find((item) => item[1] === medianValue);
  return matchingData ? matchingData[0] : null;
}

export function calculateAverageTime(data, averageValue) {
  const times = data.map((item) => item[0]);
  const averageTime = times.reduce((acc, time, index) => {
    return acc + (time - acc) / (index + 1);
  }, 0);
  return averageTime;
}
