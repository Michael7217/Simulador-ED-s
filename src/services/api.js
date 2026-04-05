import axios from "axios";

const api = Axios.create({
    baseURL: 'https://simulador-estrutura-de-dados.onrender.com'
});

export default api;