// // src/utils/fetcher.js
// import axiosInstance from './axios'; // Import axios instance

// // Fetch data using axios
// export const fetcher = async (args) => {
//   const [url, config] = Array.isArray(args) ? args : [args]; // If config is passed as array

//   try {
//     console.log('Fetching URL:', url); // Debug: Log the URL being fetched
//     const res = await axiosInstance.get(url, { ...config });
//     console.log(res); // Debug: Log the full response

//     if (res && res.data) {
//       console.log('API Response:', res); // Debug: Log the data
//       return res.data; // Return data if response is successful
//     }

//     throw new Error('API response is empty or malformed'); // If no data in response
//   } catch (error) {
//     // Handle errors (response, request, or other errors)
//     if (error.response) {
//       console.error('Fetcher Error:', error.response.status, error.response.data);
//     } else if (error.request) {
//       console.error('Fetcher Error: No response received:', error.request);
//     } else {
//       console.error('Fetcher Error:', error.message);
//     }
//     throw error; // Throw error to be handled in component
//   }
// };
