export function truncateText(text, length) {
  if (text.length > length) {
    return text.slice(0, length + 1) + "...";
  } else {
    return text;
  }
}


export function convertString(string) {
  if (string !== null) {
    // Convertir la cadena de entrada a minúsculas
    string = string.toLowerCase();

    // Dividir la cadena en un array de palabras
    const words = string.split('_');

    // Capitalizar la primera letra de la primera palabra
    const firstWordCapitalized = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    // Unir la primera palabra capitalizada con las demás palabras y devolver la cadena resultante
    return firstWordCapitalized + (words.length > 1 ? ' ' + words.slice(1).join(' ') : '');
  } else {
    return null;
  }
}