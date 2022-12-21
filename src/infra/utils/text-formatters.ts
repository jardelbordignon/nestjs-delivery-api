/** capitalizeFirstLetter('developer') -> 'Developer' */
export const capitalizeFirstLetter = (text: string) =>
  `${text.charAt(0).toUpperCase()}${text.slice(1)}`

/**
 * replaceLastComa('a, b, c') -> 'a, b and c'
 *
 * replaceLastComa('a, b, c', 'e') -> 'a, b e c'
 */
export const replaceLastComa = (text: string, substitute = ' and') =>
  text.replace(/,(?=[^,]*$)/, substitute)

/**
 * pluralize(0, 'turtle'); // turtles
 *
 * pluralize(1, 'turtle'); // turtle
 *
 * pluralize(2, 'turtle'); // turtles
 *
 * pluralize(3, 'fox', 'es'); // foxes
 */
export const pluralize = (count: number, word: string, suffix = 's') =>
  `${word}${count !== 1 ? suffix : ''}`
