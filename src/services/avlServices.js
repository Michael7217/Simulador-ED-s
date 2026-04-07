import Api from './api';

export const inserirAvl = (valor) => {
    return Api.post((`/api/avl/inserir/${valor}`));
}

export const removerAvl = (valor) => {
    return Api.delete((`/api/avl/remover/${valor}`));
}

/* visualizar avl */
export const visualizarArvore = () => {
    return Api.get(('/api/avl/arvore'));
}

export const visualizarBalsAvl = () => {
    return Api.get(('/api/avl/balanceamento'));
}