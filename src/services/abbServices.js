import Api from './api';

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
    return Api.get(('/api/abb/arvore'));
}