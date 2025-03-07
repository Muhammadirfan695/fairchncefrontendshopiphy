import axios from 'axios';

const useLogin = () => {
  const login = async (url, email, password) => {
    try {
      const response = await axios.post(url, { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data; // Handle HTTP errors
      } else if (error.request) {
        throw new Error('Server not responding. Please try again later.');
      } else {
        throw new Error(error.message);
      }
    }
  };

  return { login };
};

export default useLogin;
