import api from "./api";

export const adicionarFila = (valor) => {
    return api.post(`/api/fila/adicionar/${valor}`);
}

export const removerFila = () => {
    return api.delete('/api/fila/remover');
}

export const visualizarFila = () => {
    return api.get('/api/fila');
}