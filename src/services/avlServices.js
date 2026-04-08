import Api from './api';
import { SessionId } from '../utils/sessionId';

export const inserirAvl = (valor) => {
    return Api.post((`/api/avl/inserir/${valor}`));
}

export const removerAvl = (valor) => {
    return Api.delete((`/api/avl/remover/${valor}`));
}

/* visualizar avl */
export const visualizarArvore = () => {
    return Api.get((`/api/avl/arvore?sessionId=${SessionId()}`));
}

export const visualizarBalsAvl = () => {
    return Api.get(('/api/avl/balanceamento'));
}

export const refazerAvl = () => {
    return Api.post('/api/avl/refazer');
}

export const desfazerAvl = () => {
    return Api.post('/api/avl/desfazer');
}