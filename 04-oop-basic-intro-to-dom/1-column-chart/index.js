export default class ColumnChart {
  constructor(props) {
    const { data = [], label = '', value = 0, link = '' } = (props !== undefined) ? props : {};

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.chartHeight = 50;

    this.render();
    this.initEventListeners();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale)),
      };
    });
  }

  createColumnChart() {
    this.columnChart = document.createElement('div');
    this.columnChart.className = 'column-chart';
    this.columnChart.style = '--chart-height: 50';
  }

  createColumnChartLink() {
    if (this.link !== '') {
      this.chartLink = document.createElement('a');
      this.chartLink.className = 'column-chart__link';
      this.chartLink.href = this.link;
      this.chartLink.innerText = 'View all';
    } else {
      this.chartLink = '';
    }
  }

  createColumnChartTitle() {
    this.columnChartTitle = document.createElement('div');
    this.columnChartTitle.className = 'column-chart__title';
    this.columnChartTitle.innerHTML = `Total ${this.label}`;
  }

  createColumnChartContainer() {
    this.columnChartContainer = document.createElement('div');
    this.columnChartContainer.className = 'column-chart__container';
  }

  createColumnChartHeader() {
    this.columnChartHeader = document.createElement('div');
    this.columnChartHeader.className = 'column-chart__header';
    this.columnChartHeader.setAttribute('data-element', 'header');
    this.columnChartHeader.innerHTML = this.value;
  }

  createColumnChartBody() {
    this.columnChartBody = document.createElement('div');
    this.columnChartBody.className = 'column-chart__chart';
    this.columnChartBody.setAttribute('data-element', 'body');
  }

  fillColumnChartBody() {
    const columnProps = this.getColumnProps(this.data);

    columnProps.forEach(({ value, percent }) => {
      const column = document.createElement('div');
      column.setAttribute('data-tooltip', percent);
      column.style = `--value: ${value}`;
      this.columnChartBody.append(column);
    });
  }

  emptyColumnChartBody() {
    this.columnChart.classList.add("column-chart_loading");

    const emptyChartStyle = getComputedStyle(this.columnChartContainer, ':before');

    this.columnChartContainer.style = emptyChartStyle;
  }

  render() {
    const element = document.createElement('div'); // (*)

    this.createColumnChart();
    this.createColumnChartLink();
    this.createColumnChartTitle();
    this.createColumnChartContainer();
    this.createColumnChartHeader();
    this.createColumnChartBody();

    if (this.data.length !== 0) {
      this.fillColumnChartBody();
    } else {
      this.emptyColumnChartBody();
    }

    this.columnChart.append(this.columnChartTitle);
    this.columnChartTitle.append(this.chartLink);
    this.columnChart.append(this.columnChartContainer);
    this.columnChartContainer.append(this.columnChartHeader);
    this.columnChartContainer.append(this.columnChartBody);

    element.innerHTML = this.columnChart.outerHTML;

    this.element = element.firstElementChild;
  }

  initEventListeners() {
  }

  update(newData) {
    const newColumnProps = this.getColumnProps(newData);

    for (let index = 0; index < this.columnChartBody.children.length; index++) {
      const child = this.columnChartBody.children[index];

      child.setAttribute('data-tooltip', newColumnProps[index].percent);
      child.style = `--value: ${newColumnProps[index].value}`;
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
