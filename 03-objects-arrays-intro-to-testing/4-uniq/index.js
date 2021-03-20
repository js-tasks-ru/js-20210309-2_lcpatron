/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    function UniqException(message) {
        this.message = message;
        this.name = "Ошибка функции uniq";
    }

    if (arr === undefined) {
        return [];
    }

    if (!Array.isArray(arr))
        throw new UniqException("Переданный аргумент не является массивом");

    if (arr.length === 0) {
        return [];
    }

    const resultArray = [];

    arr.forEach((item) => {
        if (resultArray.indexOf(item) === -1) {
            resultArray.push(item);
        }
    });

    return resultArray;
}
