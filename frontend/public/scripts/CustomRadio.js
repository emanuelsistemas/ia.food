export default class CustomRadio {
    constructor(containerId, options, name, label, required) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.name = name;
        this.label = label;
        this.required = required;
        this.render();
    }

    render() {
        // Implementação do render do radio
    }

    getValue() {
        return document.querySelector(`input[name="${this.name}"]:checked`).value;
    }

    set onchange(callback) {
        this.container.addEventListener('change', (e) => {
            if (e.target.name === this.name) {
                callback(e.target.value);
            }
        });
    }
}