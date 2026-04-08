import axios from "axios";
import {SessionId} from '../utils/sessionId'

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

Api.interceptors.request.use((config) => {
    config.headers.sessionId = SessionId();
    return config;
})



export default Api;