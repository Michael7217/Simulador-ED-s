import Api from './api';
import { SessionId } from '../utils/sessionId';

export const  inserirAbb = (valor) => {
    return Api.post((`/api/abb/inserir/${valor}`));
}

export const removerAbb = (valor) => {
    return Api.delete((`/api/abb/remover/${valor}`));
}

/* visualizar percursos */

export const preOrdem = () => {
    return Api.get(('/api/abb/pre-ordem'));
}

export const posOrdem = () => {
    return Api.get(('/api/abb/pos-ordem'));
}

export const emOrdem = () => {
    return Api.get(('/api/abb/em-ordem'));
}

/* visualizar arvore */
export const visualizarAbb = () => {
    return Api.get((`/api/abb/arvore?sessionId=${SessionId()}`));
}

export const buscarAbb = (valor) => {
    return Api.get(`/api/abb/buscar/${valor}`);
}

export const desfazerAbb = () => {
    return Api.post('/api/abb/desfazer');
}

export const refazerAbb = () => {
    return Api.post('/api/abb/refazer')
}