import api from "./api";

export const adicionarLista = (dados) => {
    return api.post('/api/lista/add', dados);
}

export const adicionarListaOrdenado = (valor) => {
    return api.post(`/api/lista/add-ordenado/${valor}`);
}

export const removerListaPosicao = (pos) => {
    return api.delete(`/api/lista/remove/${pos}`);
}

export const removerListaOrdenado = (valor) => {
    return api.delete(`/api/lista/remove-ordenado/${valor}`);
}

export const visualizarLista = () => {
    return api.get('/api/lista');
}