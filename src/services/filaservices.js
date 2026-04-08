import Api from "./api";
import { SessionId } from "../utils/sessionId";

export const adicionarFila = (valor) => {
    return Api.post(`/api/fila/adicionar/${valor}`);
}

export const removerFila = () => {
    return Api.delete('/api/fila/remover');
}

export const visualizarFila = () => {
    return Api.get(`/api/fila?sessionId=${SessionId()}`);
}

export const desfazerFila = () => {
    return Api.post('/api/fila/desfazer');
}

export const refazerFila = () => {
    return Api.post('/api/fila/refazer');
}