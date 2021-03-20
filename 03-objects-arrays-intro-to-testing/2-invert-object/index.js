/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    function InvertObjectException(message) {
        this.message = message;
        this.name = "Ошибка функции invertObj";
    }

    if(obj === undefined)
        return undefined;

    if (typeof obj !== 'object')
        throw new InvertObjectException("Неверный параметр функции invertObj");

    const result = {};

    for (const [key, value] of Object.entries(obj)){
        result[value] = key;
    }

    return result;
}
