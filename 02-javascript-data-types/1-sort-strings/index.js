/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const resultArray = [...arr];

    function SortingException(message) {
        this.message = message;
        this.name = "Ошибка сортировки";
     }

    function compareString(str1, str2){
        const regexpRus = /[А-яЁё]/i;

        const compareOptions = { 
            numeric: true,
            caseFirst: 'upper' 
        };

        if(regexpRus.test(str1)){
            return str1.localeCompare(str2, 'ru', compareOptions);
        }else{
            return str1.localeCompare(str2, 'en', compareOptions);
        }
    }

    if(!Array.isArray(arr))
        throw new SortingException("Переданный аргумент не является массивом");

    switch(param){
        case 'asc':
            return resultArray.sort(compareString);;
        case 'desc':
            return resultArray.sort(compareString).reverse();
        default:
            throw new SortingException("Неверный параметр сортировки");
    }
}
