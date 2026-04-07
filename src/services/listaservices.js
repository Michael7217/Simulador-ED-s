import api from "./api";

export const adicionarLista = (valor, pos) => {
    return api.post(`/api/lista/add?valor=${valor}&pos=${pos}`);
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