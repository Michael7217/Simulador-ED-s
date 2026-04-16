import Api from "./api";
import { SessionId } from "../utils/sessionId";

export const adicionarListaOrdenado = (valor) => {
    return Api.post(`/api/lista/add-ordenado/${valor}`);
}

export const adicionarListaInicio = (valor) => {
    return Api.post(`/api/lista/add-inicio/${valor}`);
}
export const adicionarListaMeio = (valor, posicao) => {
    return Api.post(`/api/lista/add-meio/${valor}/${posicao}`);
}
export const adicionarListaFim = (valor) => {
    return Api.post(`/api/lista/add-fim/${valor}`);
}

export const removerListaPosicao = (pos) => {
    return Api.delete(`/api/lista/remove/${pos}`);
}

export const removerListaOrdenado = (valor) => {
    return Api.delete(`/api/lista/remove-ordenado/${valor}`);
}

export const visualizarLista = () => {
    return Api.get(`/api/lista`);
}

export const BuscarLista = (valor) => {
    return Api.get(`/api/lista/buscar/${valor}`);
}

export const buscarLista = (valor) => {
    return Api.get(`/api/lista/buscar/${valor}`);
}

export const desfazerLista = () => {
    return Api.post('/api/lista/desfazer');
}

export const refazerLista = () => {
    return Api.post('/api/lista/refazer');
}