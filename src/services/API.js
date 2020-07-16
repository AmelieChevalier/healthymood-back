import axios from 'axios';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const API = axios.create({ baseURL });
export const defaultFetcher = (relativeUrl, ...options) => API.get(relativeUrl, ...options).then(res => res.data);

const placeTokenInRequestHeaders = req => {
  const token = window.localStorage.getItem('authToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
};

API.interceptors.request.use(placeTokenInRequestHeaders);

export default API;
