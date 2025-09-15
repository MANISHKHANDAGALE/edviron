import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://edviron-0dv5.onrender.com/api',
});

// Add a request interceptor to include the authorization header
// we can see authtoken with its value in application of website when we use inspect in browser 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
