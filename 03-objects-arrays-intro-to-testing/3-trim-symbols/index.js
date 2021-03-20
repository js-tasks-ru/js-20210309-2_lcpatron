/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    function TrimSymbolsException(message) {
        this.message = message;
        this.name = "Ошибка функции trimSymbols";
    }

    if (typeof string !== 'string')
        throw new TrimSymbolsException("Неверный тип первого аргумента функции trimSymbols");

    if (size === undefined) {
        return string;
    }

    if (typeof size !== 'number')
        throw new TrimSymbolsException("Неверный тип второго аргумента функции trimSymbols");

    if (size == 0) {
        return ""
    }

    const length = string.length;
    let resultString = "";
    let currentSize;
    let currentSymbol;

    for (let i = 0; i < length; ) {
        let j = i;

        currentSymbol = string[i];
        currentSize = 1;

        for (j; j < length && currentSymbol === string[j]; ++j) {
            if (currentSize++ <= size)
                resultString += string[j];
        }

        i += (j - i);
    }

    return resultString;
}
