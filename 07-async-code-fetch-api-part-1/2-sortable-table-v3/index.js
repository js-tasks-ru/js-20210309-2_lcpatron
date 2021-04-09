import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  constructor(headerConfig, {
    url = '',
    data = [],
    sorted = {},
  } = {}) {
    this.headerData = headerConfig;
    this.url = url;
    this.data = data;

    this.start = 0;
    this.end = 30;

    this.sorted = sorted.id !== undefined ? sorted : {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    };

    this.initComponent();
    this.initEventListeners();
  }

  getHeader(headerData = []) {
    const header = headerData.map(({ id = "", sortable = false, title = "" }) => {
      const sortingOrder = (id === this.sorted.id) ? this.sorted.order : '';

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

  getBody(data) {
    const rows = data.map((element) => {
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

  updateTable(newData) {
    this.updateHeader();
    this.updateBody(newData);
  }

  updateHeader() {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${this.sorted.id}"]`);

    // NOTE: Remove sorting arrow from other columns
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = this.sorted.order;
  }

  updateBody(bodyData) {
    this.subElements.body.innerHTML = this.getBody(bodyData);
  }

  getTable() {
    const header = this.getHeader(this.headerData);
    return `
        <div data-element="productsContainer" class="products-list__container">
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${header}
                </div>
                <div data-element="body" class="sortable-table__body">
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

  initComponent() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.render(this.sorted.id, this.sorted.order, true);
  }

  async loadData(fieldValue, orderValue, isNewData) {
    this.subElements['loading'].style.display = 'block';

    const data = await this.getData(fieldValue, orderValue);

    this.subElements['loading'].style.display = 'none';

    this.data = isNewData ? data : [...this.data, ...data];

    if (this.data.length === 0) {
      this.subElements['emptyPlaceholder'].style.display = 'block';
    } else {
      this.subElements['emptyPlaceholder'].style.display = 'none';
    }
  }

  async getData(fieldValue, orderValue) {
    const url = new URL(`${BACKEND_URL}/${this.url}/`);

    const params = {
      _embed: 'subcategory.category',
      _sort: fieldValue,
      _order: orderValue,
      _start: this.start,
      _end: this.end,
    };

    url.search = new URLSearchParams(params).toString();

    return await fetchJson(url.toString());
  }

  async render(fieldValue = this.sorted.id, orderValue = this.sorted.order, isNewData = true) {
    await this.loadData(fieldValue, orderValue, isNewData);
    this.updateTable(this.data);
  }

  async sortOnServer(fieldValue, orderValue) {
    this.render(fieldValue, orderValue, true);
  }

  onNewDataLoad(event) {
    const scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight,
    );

    if (window.pageYOffset + document.documentElement.clientHeight >= scrollHeight) {
      this.start = this.end;
      this.end = this.end + 30;

      this.render(this.sorted.id, this.sorted.order, false);
    }
  }

  initEventListeners() {
    const headerSortableColumn = this.element.querySelectorAll('[data-sortable="true"]');

    headerSortableColumn.forEach((element) => {
      element.addEventListener('pointerdown', (event) => {
        this.sorted.id = event.currentTarget.getAttribute('data-id');
        this.sorted.order = event.currentTarget.getAttribute('data-order') === 'asc' ||
          event.currentTarget.getAttribute('data-order') === '' ? 'desc' : 'asc';

        this.sortOnServer(this.sorted.id, this.sorted.order);
      });
    });

    // Detect when scrolled to bottom.
    document.addEventListener('scroll', this.onNewDataLoad.bind(this));
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
