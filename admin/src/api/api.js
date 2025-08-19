import axios from 'axios'

const local = 'http://localhost:5000';
const production = 'https://e-project-demo-2025-a-1-3-0-serve.onrender.com'

const api = axios.create({
    baseURL: `${production}/api`,
    withCredentials: true
})

export default api;
