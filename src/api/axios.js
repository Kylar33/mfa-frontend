import axios from 'axios';

const BASE_URL = 'https://python-backend-proyecto-8914a1f616dc.herokuapp.com';

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    if (auth?.access_token) {
      config.headers.Authorization = `Bearer ${auth.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);