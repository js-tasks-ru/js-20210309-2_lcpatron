export default class NotificationMessage {
    static visible = false;

    static isVisible(){
        return NotificationMessage.visible;
    }

    static setVisible(visible){
        NotificationMessage.visible = visible;
    }

    constructor(message = 'Hello world!', { duration, type } = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
        this.initEventListeners();
    }

    getDurationInSec(duration) {
        return duration / 1000;
    }

    getTemplate() {
        return (
            `<div class="notification ${this.type}" style="--value:${this.getDurationInSec(this.duration)}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
                    </div>
                </div>
            </div>`
        );
    }

    render() {
        const element = document.createElement('div'); // (*)

        element.innerHTML = this.getTemplate();

        this.element = element.firstElementChild;
    }

    show(renderingElement = undefined) {
        if (!NotificationMessage.isVisible()) {
            NotificationMessage.setVisible(true);
        }else{
            document.querySelector('.notification').remove();
        }
        
        if (renderingElement !== undefined) {
            renderingElement.append(this.element);
        } else {
            document.body.append(this.element);
        }

        setTimeout(() => {
            this.remove();
            NotificationMessage.setVisible(false);
        }, this.duration);
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
