/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    function CreateGetterException(message) {
        this.message = message;
        this.name = "Ошибка функции createGetter";
    }

    if (typeof path !== 'string')
        throw new CreateGetterException("Неверный параметр функции createGetter");

    const objectKeys = path.split('.');

    return function (object) {
        function FindValueException(message) {
            this.message = message;
            this.name = "Ошибка поиска значения в объекте";
        }

        if (typeof object !== 'object')
            throw new FindValueException("Неверный параметр функции получения значения в объекте");

        function findValue(object, index) {
            for (const [key, value] of Object.entries(object)) {
                if (typeof object[objectKeys[index]] === 'object') {
                    let result = findValue(object[objectKeys[index]], index + 1);

                    if (result !== undefined) {
                        return result;
                    }
                } else if (key === objectKeys[index]) {
                    return value;
                }
            }
        }

        return findValue(object, 0);
    }
}
