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
        const languageList = ['ru', 'en'];

        const compareOptions = { 
            numeric: true,
            caseFirst: 'upper' 
        };

        function swap(swapResult){
            if(param === 'desc'){
                switch(swapResult){
                    case 1: 
                        return -1;
                    case -1:
                        return 1;
                    default:
                        return 0;
                }
            }

            return swapResult;
        }

        return swap(str1.localeCompare(str2, languageList, compareOptions));
    }

    if(!Array.isArray(arr))
        throw new SortingException("Переданный аргумент не является массивом");

    switch(param){
        case 'asc':
            return resultArray.sort(compareString);;
        case 'desc':
            return resultArray.sort(compareString);
        default:
            throw new SortingException("Неверный параметр сортировки");
    }
}
