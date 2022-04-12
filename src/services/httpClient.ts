import axios, { HeadersDefaults } from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-type': 'application/json',
  },
});

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

service.defaults.headers = {
  Authorization: '',
} as CommonHeaderProperties;

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const newConfig = config;

    if (token) {
      // let each request carry token
      const { headers } = config;
      newConfig.headers = {
        ...headers,
        Authorization: `Bearer: ${token}`,
      };
    }

    return newConfig;
  },
  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

export default service;
