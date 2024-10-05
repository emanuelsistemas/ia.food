class CustomFileInput {
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
        this.fileGroup = document.createElement('div');
        this.fileGroup.className = 'form-group';

        this.label = document.createElement('label');
        this.label.className = 'anexo-label';
        this.label.htmlFor = this.options.id;

        this.icon = document.createElement('span');
        this.icon.className = 'icon';
        this.icon.textContent = '📎';

        this.labelText = document.createTextNode(' Adicionar anexo');

        this.label.appendChild(this.icon);
        this.label.appendChild(this.labelText);

        this.input = document.createElement('input');
        this.input.type = 'file';
        this.input.id = this.options.id;
        this.input.name = this.options.name;
        this.input.accept = this.options.accept || '.txt,.jpg,.jpeg,.png,.bmp,.gif,.pdf';
        this.input.style.display = 'none';

        this.small = document.createElement('small');
        this.small.textContent = this.options.acceptText || 'txt, jpg, jpeg, png, bmp, gif, pdf';

        this.fileGroup.appendChild(this.label);
        this.fileGroup.appendChild(this.input);
        this.fileGroup.appendChild(this.small);

        this.container.appendChild(this.fileGroup);
    }

    setupEventListeners() {
        this.input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.label.textContent = `📎 ${e.target.files[0].name}`;
            } else {
                this.label.textContent = '📎 Adicionar anexo';
            }
        });
    }

    getValue() {
        return this.input.files[0];
    }

    reset() {
        this.input.value = '';
        this.label.textContent = '📎 Adicionar anexo';
    }
}

export default CustomFileInput;