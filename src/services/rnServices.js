import Api from './api';

export const inserirRn = (valor) => {
    return Api.post(`/api/rubro-negra/inserir/${valor}`);
}

export const listarRn = () => {
    return Api.get('/api/rubro-negra/listar');
}

export const buscarRn = (valor) => {
    return Api.get(`/api/rubro-negra/buscar/${valor}`);
}

export const removerRn = (valor) => {
    return Api.delete(`/api/rubro-negra/remover/${valor}`);
}