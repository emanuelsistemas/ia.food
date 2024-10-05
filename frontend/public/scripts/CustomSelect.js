export default class CustomSelect {
    constructor(id, options, placeholder) {
        this.element = document.getElementById(id);
        this.options = options;
        this.placeholder = placeholder;
        this.render();
    }

    render() {
        this.element.innerHTML = `
            <div class="select-container">
                <select id="${this.element.id}" class="custom-select">
                    <option value="" disabled selected hidden>${this.placeholder}</option>
                    ${this.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                </select>
                <label for="${this.element.id}" class="floating-label">${this.placeholder}</label>
            </div>
        `;
        
        this.select = this.element.querySelector('select');
        this.label = this.element.querySelector('label');
        
        this.addFloatingLabelEffect();
    }

    addFloatingLabelEffect() {
        this.select.addEventListener('change', () => {
            if (this.select.value !== '') {
                this.label.classList.add('active');
            } else {
                this.label.classList.remove('active');
            }
        });

        this.select.addEventListener('focus', () => {
            this.label.classList.add('active');
        });

        this.select.addEventListener('blur', () => {
            if (this.select.value === '') {
                this.label.classList.remove('active');
            }
        });
    }

    getValue() {
        return this.select.value;
    }

    updateFloatingLabel() {
        if (this.select.value !== '') {
            this.label.classList.add('active');
        } else {
            this.label.classList.remove('active');
        }
    }
}