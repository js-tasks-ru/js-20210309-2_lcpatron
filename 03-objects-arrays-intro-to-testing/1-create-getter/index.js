/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const objectKeys = path.split('.');

    return function (object) {
        function findValue(object, index) {
            if (typeof object[objectKeys[index]] === 'object') {
                return findValue(object[objectKeys[index]], index + 1);
            } else{
                return object[objectKeys[index]];
            }
        }

        return findValue(object, 0);
    }
}
