document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('.custom-select');
    const selectTrigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-option');
    const searchInput = select.querySelector('.search-input');
    const floatingLabel = select.querySelector('.floating-label');
    const defaultText = "Selecione seu segmento";
    const radioButtons = document.querySelectorAll('input[name="documento"]');
    const cnpjField = document.getElementById('cnpj').closest('.floating-input');
    const cpfField = document.getElementById('cpf').closest('.floating-input');
    const razaoSocialField = document.getElementById('razao_social').closest('.floating-input');
    const documentInput = document.getElementById('cnpj');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cnpjSearchButton = document.querySelector('.cnpj-search-button');
    const floatingInputs = document.querySelectorAll('.floating-input input');

    function updateSelectState() {
        const span = selectTrigger.querySelector('span');
        if (span && span.textContent !== "") {
            select.classList.add('filled');
            floatingLabel.classList.add('active');
        } else {
            select.classList.remove('filled');
            floatingLabel.classList.remove('active');
        }
    }

    // Toggle open/close of select dropdown
    selectTrigger.addEventListener('click', () => {
        select.classList.toggle('open');
        updateSelectState();
        if (select.classList.contains('open') && searchInput) {
            searchInput.focus();
        }
    });

    // Close select dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

    // Option selection
    options.forEach(option => {
        option.addEventListener('click', () => {
            const span = selectTrigger.querySelector('span');
            if (span) {
                span.textContent = option.textContent;
            }
            select.classList.remove('open');
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            updateSelectState();
        });
    });

    // Reset to default text if clicking on the trigger when an option is selected
    selectTrigger.addEventListener('click', () => {
        const span = selectTrigger.querySelector('span');
        if (select.classList.contains('open') && span && span.textContent !== "") {
            span.textContent = "";
            options.forEach(opt => opt.classList.remove('selected'));
            updateSelectState();
        }
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        // Prevent the select from closing when clicking on the search input
        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Inicializar o estado do select
    updateSelectState();

    // Controle de visibilidade para campos CNPJ e Razão Social
    function toggleFields() {
        const isCNPJ = document.querySelector('input[name="documento"]:checked').value === 'cnpj';
        cnpjField.classList.toggle('hidden', !isCNPJ);
        cpfField.classList.toggle('hidden', isCNPJ);
        razaoSocialField.classList.toggle('hidden', !isCNPJ);

        if (isCNPJ) {
            cpfInput.value = '';
        } else {
            documentInput.value = '';
            document.getElementById('razao_social').value = '';
        }
        updateFloatingLabels();
        applyMask();
    }

    radioButtons.forEach(button => {
        button.addEventListener('change', toggleFields);
    });

    // Inicializar o estado dos campos
    toggleFields();

    // Controle do efeito floating label para inputs
    function updateFloatingLabel(inputContainer, isFocused = false) {
        const input = inputContainer.querySelector('input');
        inputContainer.classList.toggle('filled', input.value !== '' || isFocused);
    }

    floatingInputs.forEach(input => {
        input.addEventListener('focus', () => {
            const inputContainer = input.closest('.floating-input');
            inputContainer.classList.add('focused');
            updateFloatingLabel(inputContainer, true);
        });

        input.addEventListener('blur', () => {
            const inputContainer = input.closest('.floating-input');
            inputContainer.classList.remove('focused');
            updateFloatingLabel(inputContainer);
        });

        input.addEventListener('input', () => {
            updateFloatingLabel(input.closest('.floating-input'));
        });

        // Verificar o estado inicial
        updateFloatingLabel(input.closest('.floating-input'));
    });

    // Aplicar máscaras para CNPJ e CPF
    function applyMask() {
        const documentType = document.querySelector('input[name="documento"]:checked').value;
        if (documentType === 'cnpj') {
            VMasker(documentInput).maskPattern('99.999.999/9999-99');
            documentInput.setAttribute('maxlength', '18');
        } else {
            VMasker(cpfInput).maskPattern('999.999.999-99');
            cpfInput.setAttribute('maxlength', '14');
        }
    }

    VMasker(telefoneInput).maskPattern('(99) 99999-9999');

    // Funcionalidade de busca de CNPJ
    cnpjSearchButton.addEventListener('click', searchCNPJ);

    async function searchCNPJ() {
        const cnpj = documentInput.value.replace(/\D/g, '');
        if (cnpj.length !== 14) {
            alert('Por favor, insira um CNPJ válido.');
            return;
        }

        cnpjSearchButton.classList.add('loading');

        try {
            const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            document.getElementById('razao_social').value = data.razao_social;
            document.getElementById('nome_fantasia').value = data.estabelecimento.nome_fantasia || '';
            
            const telefone = (data.estabelecimento.ddd1 || '') + (data.estabelecimento.telefone1 || '');
            telefoneInput.value = telefone;
            VMasker(telefoneInput).maskPattern('(99) 99999-9999');
            
            document.getElementById('email').value = data.estabelecimento.email || '';

            updateFloatingLabels();
        } catch (error) {
            alert('Erro ao buscar CNPJ: ' + error.message);
        } finally {
            cnpjSearchButton.classList.remove('loading');
        }
    }

    function updateFloatingLabels() {
        floatingInputs.forEach(input => {
            updateFloatingLabel(input.closest('.floating-input'));
        });
    }

    // Inicialização
    toggleFields();
    applyMask();
    updateFloatingLabels();
});