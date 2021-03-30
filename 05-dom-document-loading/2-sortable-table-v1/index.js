export default class SortableTable {
    constructor(header = [], { data } = {}) {
        this.headerData = header;
        this.bodyData = data;

        this.subElements = {
            header: this.createHeader(),
            body: this.createBody(),
        }

        this.sortingColumnName = "";
        this.sortingColumnOrder = "";

        this.render();
    }

    createHeader(){
        const header = document.createElement('div');
        header.className = 'sortable-table__header sortable-table__row';
        header.setAttribute('data-element', 'header');

        return header;
    }

    createBody(){
        const body = document.createElement('div');
        body.className = 'sortable-table__body';
        body.setAttribute('data-element', 'body');

        return body;
    }

    getHeader() {
        const header = document.createElement('div');

        this.headerData.forEach(({ id = "", sortable = false, title = "" }) => {
            const sortingOrder = (id !== this.sortingColumnName) ? "" : this.sortingColumnOrder;

            const sortingArrow = (id === this.sortingColumnName) ?
                `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>` : '';

            const column =
                `<div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${sortingOrder}>
                    <span>${title}</span>
                    ${sortingArrow}
                </div>`;

            header.insertAdjacentHTML('beforeend', column);
        });

        return header.innerHTML;
    }

    getBody() {
        const data = (this.sortingColumnName === "") ?
            this.bodyData :
            this.sortStrings(this.bodyData, this.sortingColumnName, this.sortingColumnOrder);

        const rows = document.createElement('div');

        data.forEach((element) => {
            const cells = document.createElement('div');

            this.headerData.forEach(column => {
                const cell = column.template === undefined ?
                    `<div class="sortable-table__cell">${element[column.id]}</div>`
                    :
                    column.template(element[column.id]);

                cells.insertAdjacentHTML('beforeend', cell);
            })

            const row = `
                <a href="/products/${element.id}" class="sortable-table__row">
                    ${cells.innerHTML}
                </a>
            `;

            rows.insertAdjacentHTML('beforeend', row);
        });

        return rows.innerHTML;
    }

    sortStrings(arr, field, param = 'asc') {
        const resultArray = [...arr];

        function SortingException(message) {
            this.message = message;
            this.name = "Ошибка сортировки";
        }

        function compareString(obj1, obj2) {
            const languageList = ['ru', 'en'];

            const compareOptions = {
                numeric: true,
                caseFirst: 'upper'
            };

            function swap(swapResult) {
                if (param === 'desc') {
                    switch (swapResult) {
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

            return swap(String(obj1[field]).localeCompare(String(obj2[field]), languageList, compareOptions));
        }

        if (!Array.isArray(arr))
            throw new SortingException("Переданный аргумент не является массивом");

        switch (param) {
            case 'asc':
                return resultArray.sort(compareString);
            case 'desc':
                return resultArray.sort(compareString);
            default:
                throw new SortingException("Неверный параметр сортировки");
        }
    }

    sort(fieldValue, orderValue) {
        this.sortingColumnName = fieldValue;
        this.sortingColumnOrder = orderValue;

        this.changeHeader();
        this.changeBody();
    }

    changeHeader(){
        this.subElements.header.innerHTML = this.getHeader();
        const header = document.querySelector('.sortable-table__header');

        header.innerHTML = this.subElements.header.innerHTML;
    }

    changeBody(){
        this.subElements.body.innerHTML = this.getBody();
        const body = document.querySelector('.sortable-table__body');

        body.innerHTML = this.subElements.body.innerHTML;
    }

    getTemplate() {
        this.subElements.header.innerHTML = this.getHeader();
        this.subElements.body.innerHTML = this.getBody();

        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.subElements.header.outerHTML}
                    ${this.subElements.body.outerHTML}
                    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                        <div>
                            <p>No products satisfies your filter criteria</p>
                            <button type="button" class="button-primary-outline">Reset all filters</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const element = document.createElement('div'); // (*)

        element.innerHTML = this.getTemplate();

        this.element = element.firstElementChild;
    }

    initEventListeners() {
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}

