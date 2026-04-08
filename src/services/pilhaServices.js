import Api from "./api";
import { SessionId } from "../utils/sessionId";

export const inserirPilha = (valor) => {
    return Api.post(`/api/pilha/inserir/${valor}`);
}

export const removerPilha = () => {
    return Api.delete('/api/pilha/remover'); 
}

export const visualizarPilha = () => {
    return Api.get(`/api/pilha?sessionId=${SessionId()}`);
}

export const refazerPilha = () => {
    return Api.post('/api/pilha/refazer');
}

export const desfazerPilha = () => {
    return Api.post('/api/pilha/desfazer');
}
