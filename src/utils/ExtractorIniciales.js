export const getInitial = (fullName) => {
    // 1. Manejar valores nulos/indefinidos y limpiar espacios en blanco.
    const nombrePartido = fullName?.trim() || '';

    if (!nombrePartido) {
        return '?';
    } 
 
    // 2. Dividir el nombre por cualquier tipo de espacio (simple, doble, etc.)
    // y filtrar cualquier cadena vacía que pueda resultar (e.g., de dobles espacios).
    const nameParts = nombrePartido.split(/\s+/).filter(p => p.length > 0);

    // Si no hay partes válidas después de la limpieza.
    if (nameParts.length === 0) {
        return '?';
    }

    // 3. Tomar la inicial de la primera parte.
    const firstInitial = nameParts[0][0].toUpperCase();

    // 4. Si solo hay una parte (un solo nombre o apellido), devuelve solo esa inicial.
    if (nameParts.length === 1) {
        return firstInitial;
    }

    // 5. Tomar la inicial de la última parte (que asumimos es el apellido)
    const lastInitial = nameParts[nameParts.length - 1][0].toUpperCase();

    // 6. Concatenar y devolver las dos iniciales.
    return firstInitial + lastInitial;
};
