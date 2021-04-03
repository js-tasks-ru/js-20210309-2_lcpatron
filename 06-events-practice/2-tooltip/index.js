class Tooltip {
    static instance;

    visible = false;

    constructor() {
        this.tooltipText = "";

        this.initEventListner();
    }

    getTooltip(tooltipText){
        return `
            <div class="tooltip">${tooltipText}</div>
        `;
    }

    render(tooltipText = '', tooltipX = undefined, tooltipY = undefined) {
        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTooltip(tooltipText);

        const element = wrapper.firstElementChild;

        this.element = element;
        this.element.hidden = this.visible;
        this.positionate(tooltipX, tooltipY);

        document.body.appendChild(this.element);
    }

    positionate(positionX, positionY){
        this.element.style.left = positionX + 'px';
        this.element.style.top = positionY + 'px';
    }

    show(event) {
        let tooltip = document.querySelector('.tooltip');

        if(tooltip) {
            this.visible = true;
            return;
        }

        this.visible = false;
        this.render(event.target.dataset.tooltip, event.clientX, event.clientY);
    }

    initialize(){
        if(Tooltip.instance){
            return Tooltip.instance;
        }

        Tooltip.instance = this;

        return Tooltip.instance;
    }

    hide(event) {
        let tooltip = document.querySelector('.tooltip');

        if(!tooltip) {
            this.visible = false;
            return this;
        }

        this.visible = false;

        tooltip.remove();
    }

    initEventListner() {
        document.addEventListener('pointerover', (event) => {
            if (event.target.dataset.tooltip != undefined) {
                this.show(event);
            }
        });

        document.addEventListener('pointerout', (event) => {
            if (event.target.dataset.tooltip != undefined) {
                this.hide();
            }
        });

        document.addEventListener('pointermove', (event) => {
            if (event.target.dataset.tooltip != undefined) {
                this.positionate(event.clientX, event.clientY);
            }
        });
    }

    destroy() {
        this.element.remove()
    }
}

const tooltip = new Tooltip();

export default tooltip;
