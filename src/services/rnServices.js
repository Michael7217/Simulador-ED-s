import Api from './api';
import { SessionId } from '../utils/sessionId';

export const inserirRn = (valor) => {
    return Api.post(`/api/rubro-negra/inserir/${valor}`);
}

export const listarRn = () => {
    return Api.get(`/api/rubro-negra/listar?sessionId=${SessionId()}`);
}

export const buscarRn = (valor) => {
    return Api.get(`/api/rubro-negra/buscar/${valor}`);
}

export const removerRn = (valor) => {
    return Api.delete(`/api/rubro-negra/remover/${valor}`);
}

export const refazerRn = () => {
    return Api.post('/api/rubro-negra/refazer');
}

export const desfazerRn = () => {
    return Api.post('/api/rubro-negra/desfazer');
}