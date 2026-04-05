import { Axios } from "axios";

const Api = Axios.create({
    baseURL: 'https://simulador-estrutura-de-dados.onrender.com'
});

export default Api;