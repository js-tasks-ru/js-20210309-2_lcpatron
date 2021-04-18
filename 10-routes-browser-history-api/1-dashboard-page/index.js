import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    constructor() {

        this.initComponents();
        this.initEventListeners();
    }

    initComponents() {
        const from = new Date('2020-04-06');
        const to = new Date('2020-05-06');


        const sortableTable = new SortableTable(header, {
            url: `api/dashboard/bestsellers?from=${from}&to=${to}&_sort=title&_order=asc&_start=0&_end=30`,
            isSortLocally: true,
        });

        const rangePicker = new RangePicker({
            from,
            to,
        });

        const ordersChart = new ColumnChart({
            url: 'api/dashboard/orders',
            range: {
                from,
                to,
            },
            label: 'orders',
            link: '#'
        });

        const salesChart = new ColumnChart({
            url: 'api/dashboard/sales',
            range: {
                from,
                to,
            },
            label: 'sales',
            formatHeading: data => `$${data}`
        });

        const customersChart = new ColumnChart({
            url: 'api/dashboard/customers',
            range: {
                from,
                to,
            },
            label: 'customers',
        });

        this.components = {
            sortableTable,
            rangePicker,
            ordersChart,
            salesChart,
            customersChart,
        }
    }

    getTemplate(){
        return`
            <div class="dashboard full-height flex-column">
                <div class="content__top-panel">
                    <h2 class="page-title">Панель управления</h2>
                    <div data-element="rangePicker" class="rangepicker"></div>
                </div>
                <div class="dashboard__charts">
                    <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                    <div data-element="salesChart" class="dashboard__chart_sales"></div>
                    <div data-element="customersChart" class="dashboard__chart_customers"></div>
                </div>
                <h3 class="block-title">Лидеры продаж</h3>
                <div data-element="sortableTable" class="sortable-table"></div>
            </div>
        `;
    }

    async render() {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTemplate();

        this.element = wrapper.firstElementChild;

        this.subElements = this.getSubElements(this.element);

        const subElementsFields = Object.keys(this.subElements);

        for(const index in subElementsFields){
            this.subElements[subElementsFields[index]].append(this.components[subElementsFields[index]].element);
        }

        return this.element;
    }

    async updateComponents(from, to){
        const data = await fetchJson(`${BACKEND_URL}api/dashboard/bestsellers?from=${from}&to=${to}&_sort=title&_order=asc&_start=0&_end=30`);
        this.components.sortableTable.addRows(data);

        this.components.ordersChart.update(from, to);
        this.components.salesChart.update(from, to);
        this.components.customersChart.update(from, to);
    }

    initEventListeners(){
        const onUpdatePage = (event) => {
            const {from, to} = event.detail;
    
            this.updateComponents(from, to);
        }

        this.components.rangePicker.element.addEventListener('date-select', onUpdatePage);
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

    remove(){
        this.destroy();
    }

    destroy() {
        this.element.remove();
    }
}
