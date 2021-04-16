export default class SortableList {
    constructor({ items = [] } = {}) {
        this.items = items;

        this.render();
    }

    getTemplate(items) {
        return `
            <ul class="sortable-list">
                ${items.map(item => {
                    item.classList.add('sortable-list__item');
                    return item.outerHTML
                }).join('')}
            </ul>
        `;
    }

    render() {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTemplate(this.items);

        const element = wrapper.firstElementChild;

        this.element = element;
    }
}
