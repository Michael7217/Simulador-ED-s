import Api from "./api";

export const inserirPilha = (valor) => {
    return Api.post(`/api/pilha/inserir/${valor}`);
}

export const removerPilha = () => {
    return Api.delete('/api/pilha/removedor'); 
}

export const visualizarPilha = () => {
    return Api.get('/api/pilha');
}