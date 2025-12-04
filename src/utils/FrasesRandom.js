import data from "../api/frases.json";

export const frasesRandom = () => {
    const listaFrases = data.frases;

    if (!listaFrases || listaFrases.length === 0) {
        return {
            frase: "¡Bienvenido! Es hora de tomar el control de tus finanzas.",
            autor: "MyPocket App"
        };
    }

    const randomIndex = Math.floor(Math.random() * listaFrases.length);
    const seleccionada = listaFrases[randomIndex];

    // Mapeamos las propiedades para que coincidan con lo que esperan los componentes
    return {
        frase: seleccionada.phrase,
        autor: seleccionada.author
    };
}