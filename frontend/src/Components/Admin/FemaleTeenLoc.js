// import React from 'react';
// import Paper from '@mui/material/Paper';
// import Chart from 'react-apexcharts';
// import { scalePoint } from 'd3-scale';

// const femaleTeenagersData = [
//   { location: 'Location 1', count: 50 },
//   { location: 'Location 2', count: 70 },
//   { location: 'Location 3', count: 90 },
//   { location: 'Location 4', count: 110 },
//   { location: 'Location 5', count: 130 },
// ];

// const FemaleTeenagersChart = () => {
//   const chartData = {
//     options: {
//       chart: {
//         id: 'female-teenagers-chart',
//         type: 'area',
//         width: '100%', // Set the width to 100%
//       },
//       xaxis: {
//         type: 'category',
//         categories: femaleTeenagersData.map(data => data.location),
//       },
//     },
//     series: [{
//       name: 'Female Teenagers',
//       data: femaleTeenagersData.map(data => data.count),
//     }],
//   };

//   return (
//     <Paper>
//       <Chart
//         options={chartData.options}
//         series={chartData.series}
//         type="area"
//         height={350}
//       />
//     </Paper>
//   );
// };

// export default FemaleTeenagersChart;
