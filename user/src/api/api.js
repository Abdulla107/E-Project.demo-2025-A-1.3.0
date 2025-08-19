import axios from 'axios'

const local = 'http://localhost:5000';
const production = 'https://e-project-demo-2025-a-1-server.onrender.com'

const api = axios.create({
    baseURL: `${local}/api`,
    withCredentials: true
})


export default api;
