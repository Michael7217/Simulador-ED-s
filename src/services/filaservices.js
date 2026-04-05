import Api from "./api";

export const adicionarFila = (valor) => {
    return Api.post(`/api/fila/adicionar/${valor}`);
}

export const removerFila = () => {
    return Api.delete('/api/fila/remover');
}

export const visualizarFila = () => {
    return Api.get('/api/fila');
}