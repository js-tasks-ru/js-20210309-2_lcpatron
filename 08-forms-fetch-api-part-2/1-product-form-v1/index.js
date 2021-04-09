import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru/';
const API_URL_PRODUCTS = 'api/rest/products/';
const API_URL_CATEGORIES = 'api/rest/categories/';

export default class ProductForm {
  constructor(productId = false) {
    this.productId = productId;

    this.initComponent();
    this.initEventListeners();
  }

  initComponent() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);
  }

  getTemplate() {
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input data-element="title" id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea required="" class="form-control" id="description" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline">
              <span>Загрузить</span>
            </button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select data-element="subcategory" id ="subcategory" class="form-control" name="subcategory">
              
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input data-element="price" id="price" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input data-element="discount" id="discount" equired="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input data-element="quantity" id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select data-element="status" id="status" class="form-control" name="status">
              <option value="1">Активен</option>
              <option value="0">Неактивен</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              Сохранить товар
            </button>
          </div>
        </form>
      </div>
    `;
  }

  getSubcategoryListTemplate(value, text, defaultSelected, selected) {
    return new Option(text, value, defaultSelected, selected);
  }

  getPhotoListTemplate(url, source) {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${url}">
        <input type="hidden" name="source" value="${source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${url}">
          <span>${source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>
    `;
  }

updateForm(data, categories) {
  data.forEach(({
    description = "",
    discount = 0,
    images = [],
    price = 100,
    quantity = 1,
    status = 1,
    subcategory = "",
    title = ""}) => {
    this.subElements.title.value = title;

    this.subElements.productDescription.innerHTML = description;

    const photoList = document.createElement('ul');
    photoList.className = 'sortable-list';
    images.forEach(({ url = "", source = "" }) => {
      photoList.insertAdjacentHTML('beforeend', this.getPhotoListTemplate(url, source));
    });
    this.subElements.imageListContainer.innerHTML = photoList.outerHTML;

    this.subElements.price.value = price;

    this.subElements.discount.value = discount;

    this.subElements.quantity.value = quantity;

    const selectSubcategories = document.createElement('div');
    
    categories.forEach((category) => {
      category.subcategories.forEach((subcategoryItem) => {
        selectSubcategories.append(this.getSubcategoryListTemplate(
          subcategoryItem.id,
          `${category.title} > ${subcategoryItem.title}`,
          subcategory === subcategoryItem.id,
          subcategory === subcategoryItem.id));
      });
    });
    this.subElements.subcategory.innerHTML = selectSubcategories.innerHTML;

    this.subElements.status.value = status;
  });
}

async render() {
  await this.loadData();
  this.updateForm(this.data, this.categories);

  return this.element;
}

async loadData() {
  this.categories = await this.getCategories();

  if (this.productId) {
    this.data = await this.getProducts();
  } else {
    this.data = [{}];
  }
}

async getCategories() {
  const url = new URL(`${BACKEND_URL}${API_URL_CATEGORIES}`);

  const params = {
    _sort: 'weight',
    _refs: 'subcategory',
  };

  url.search = new URLSearchParams(params).toString();

  return await fetchJson(url.toString());
}

async getProducts() {
  const url = new URL(`${BACKEND_URL}${API_URL_PRODUCTS}`);

  const params = {
    id: this.productId,
  };

  url.search = new URLSearchParams(params).toString();

  return await fetchJson(url.toString());
}

create(){
  this.element.dispatchEvent(new CustomEvent("product-saved", { bubbles: true, detail: "Обновить" }));
}

save(){
  this.element.dispatchEvent(new CustomEvent("product-updated", { bubbles: true, detail: "Сохранить" }));
}

initEventListeners() {
  this.subElements.productForm.addEventListener('submit', (event) => {
    if (this.productId) {
      this.save();
    } else {
      this.create();
    }
  })
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
  this.element.remove();
}

destroy() {
  this.element.remove();
  this.subElements = {};
}
}
