import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nodedeploy.api-gobarber.online/',
});

export default api;
