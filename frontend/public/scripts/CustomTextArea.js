class CustomTextArea {
    constructor(containerId, options) {
        this.container = document.getElementById(containerId);
        this.options = options;
        this.init();
    }

    init() {
        this.createElements();
        this.setupEventListeners();
    }

    createElements() {
        this.textareaGroup = document.createElement('div');
        this.textareaGroup.className = 'form-group';

        this.textarea = document.createElement('textarea');
        this.textarea.id = this.options.id;
        this.textarea.name = this.options.name;
        this.textarea.required = this.options.required || false;
        this.textarea.rows = this.options.rows || 5;
        this.textarea.placeholder = this.options.placeholder || '';

        this.textareaGroup.appendChild(this.textarea);
        this.container.appendChild(this.textareaGroup);
    }

    setupEventListeners() {
        // Adicione event listeners se necessário
    }

    getValue() {
        return this.textarea.value;
    }

    setValue(value) {
        this.textarea.value = value;
    }
}

export default CustomTextArea;