import axios from 'axios';

// Create Axios Instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST_API,
  timeout: 40000, // Optional: Add timeout for requests
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.REACT_APP_POSTEX_API_TOKEN}`, // Shopify token
  },
});

// Interceptor to add Postex token dynamically based on request URL
axiosInstance.interceptors.request.use(
  (config) => {
    // Check if the request is for Postex API and add the Postex token
    if (config.url.includes('/api/postex/')) {
      config.headers.token = `${process.env.REACT_APP_POSTEX_API_TOKEN}`; // Postex token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

// Fetcher Function
export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  try {
    console.log('Fetching URL:', url); // Check if the correct URL is being passed
    const res = await axiosInstance.get(url, { ...config });
    console.log(res);

    if (res && res.data) {
      console.log('API Response:', res); // Check if data is present in response
      return res.data;
    }
    throw new Error('API response is empty or malformed');
  } catch (error) {
    if (error.response) {
      console.error('Fetcher Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Fetcher Error: No response received:', error.request);
    } else {
      console.error('Fetcher Error:', error.message);
    }
    throw error;
  }
};

// ----------------------------------------------------------------------

// Endpoints
export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/platform/redirectRequest',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/read_products',
    details: '/api/product/details',
    search: '/api/product/search',
    shopify: 'api/shopify/products',
    analytics: 'api/shopify/analytics',
  },
  order: {
    create: 'api/postex/createOrders',
  },
  merchants: {
    create: '/api/postex/createMerchantStore',
  },
};
