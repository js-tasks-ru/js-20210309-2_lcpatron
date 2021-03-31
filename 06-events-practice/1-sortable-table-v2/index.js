export default class SortableTable {
    subElements = {};

    constructor(header = [],
        { data } = {},
        { sortingValue, sortingOrder } = {
            sortingValue: this.getDefaultSortColumn(header),
            sortingOrder: "asc",
        }) {
        this.headerData = header;
        this.bodyData = data;

        this.sortingColumnName = sortingValue;
        this.sortingColumnOrder = sortingOrder;

        this.render();
        this.initEventListeners();
    }

    getDefaultSortColumn(headerData) {
        for (let column of headerData)
            if (column.sortable) {
                return column.id;
            }

        return;
    }

    getHeader(headerData = []) {
        const header = headerData.map(({ id = "", sortable = false, title = "" }) => {
            const sortingOrder = (id !== this.sortingColumnName) ? "" : this.sortingColumnOrder;

            const sortingArrow =
                `<span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>`;

            const column =
                `<div class="sortable-table__cell" data-id=${id} data-sortable=${sortable} data-order=${sortingOrder}>
                    <span>${title}</span>
                    ${sortingArrow}
                </div>`;

            return column;
        });

        return header.join('');
    }

    getBody(bodyData = []) {
        const rows = bodyData.map((element) => {
            const cells = this.headerData.map(column => {
                const cell = column.template === undefined ?
                    `<div class="sortable-table__cell">${element[column.id]}</div>`
                    :
                    column.template(element[column.id]);

                return cell;
            })

            const row = `
                <a href="/products/${element.id}" class="sortable-table__row">
                    ${cells.join('')}
                </a>
            `;

            return row;
        });

        return rows.join('');
    }

    sortData(fieldValue, orderValue = 'asc') {
        const resultArray = [...this.bodyData];

        function SortingException(message) {
            this.message = message;
            this.name = "Ошибка сортировки";
        }

        function compareString(obj1, obj2) {
            const languageList = ['ru', 'en'];

            const compareOptions = {
                numeric: true,
                caseFirst: 'upper',
            };

            function swap(swapResult) {
                if (orderValue === 'desc') {
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

            return swap(String(obj1[fieldValue]).localeCompare(String(obj2[fieldValue]), languageList, compareOptions));
        }

        if (orderValue === 'asc' || orderValue === 'desc')
            resultArray.sort(compareString);
        else
            throw new SortingException("Неверный параметр сортировки");

        return resultArray;
    }

    sort(fieldValue, orderValue) {
        this.sortingColumnName = fieldValue;
        this.sortingColumnOrder = orderValue;

        const sortedData = this.sortData(fieldValue, orderValue);

        this.updateTable(sortedData);
    }

    updateTable(newData) {
        this.updateHeader();
        this.updateBody(newData);
    }

    updateHeader() {
        const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${this.sortingColumnName}"]`);

        // NOTE: Remove sorting arrow from other columns
        allColumns.forEach(column => {
            column.dataset.order = '';
        });

        currentColumn.dataset.order = this.sortingColumnOrder;
    }

    updateBody(bodyData) {
        this.subElements.body.innerHTML = this.getBody(bodyData);
    }

    getTable() {
        const sortedData = this.sortData(this.sortingColumnName, this.sortingColumnOrder);
        const header = this.getHeader(this.headerData);
        const body = this.getBody(sortedData);

        return `
            <div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    <div data-element="header" class="sortable-table__header sortable-table__row">
                        ${header}
                    </div>
                    <div data-element="body" class="sortable-table__body">
                        ${body}
                    </div>
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
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTable();

        const element = wrapper.firstElementChild;

        this.element = element;
        this.subElements = this.getSubElements(element);
    }

    initEventListeners() {
        const headerSortableColumn = this.element.querySelectorAll('[data-sortable="true"]');

        headerSortableColumn.forEach((element) => {
            element.addEventListener('pointerdown', (event) => {
                const fieldValue = event.currentTarget.getAttribute('data-id');
                const orderValue = event.currentTarget.getAttribute('data-order') === 'asc' ||
                    event.currentTarget.getAttribute('data-order') === '' ? 'desc' : 'asc';

                this.sort(fieldValue, orderValue);
            });
        });
    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');

        for (const subElement of elements) {
            const name = subElement.dataset.element;

            result[name] = subElement;
        }

        return result;
    }

    destroy() {
        this.element.remove();
        this.subElements = {};
    }
}