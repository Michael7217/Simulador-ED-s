import api from "./api";

export const inserirPilha = (valor) => {
    return api.post(`/api/pilha/inserir/${valor}`);
}

export const removerPilha = () => {
    return api.delete('/api/pilha/removedor'); 
}

export const visualizarPilha = () => {
    return api.get('/api/pilha');
}