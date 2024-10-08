document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroEmpresaForm');
    if (form) {
        initializeCustomSelect();
        setupFormValidation();
        setupPasswordToggle();
        setupInputMasks();
        setupCNPJSearch();
    } else {
        console.error('Formulário de cadastro não encontrado');
    }
});

function initializeCustomSelect() {
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
            // Garantir que o asterisco seja mantido
            if (!floatingLabel.querySelector('.required')) {
                const asterisk = document.createElement('span');
                asterisk.className = 'required';
                asterisk.textContent = '*';
                floatingLabel.appendChild(asterisk);
            }
        } else {
            select.classList.remove('filled');
            floatingLabel.classList.remove('active');
            // Restaurar o texto original com o asterisco
            floatingLabel.innerHTML = 'Selecione seu segmento<span class="required">*</span>';
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
        const label = inputContainer.querySelector('.floating-label');
        inputContainer.classList.toggle('filled', input.value !== '' || isFocused);
        
        // Ajustar o texto do label quando estiver focado ou preenchido
        if (input.id === 'senha' || input.id === 'confirmar_senha') {
            if (input.value !== '' || isFocused) {
                label.textContent = input.id === 'senha' ? 'Senha (máximo 5 dígitos)' : 'Confirmar Senha (máximo 5 dígitos)';
            } else {
                label.textContent = input.id === 'senha' ? 'Senha' : 'Confirmar Senha';
            }
        }
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

    // Aplicar máscaras para CNPJ, CPF e telefone
    function applyMask() {
        const documentType = document.querySelector('input[name="documento"]:checked').value;
        if (documentType === 'cnpj') {
            VMasker(documentInput).maskPattern('99.999.999/9999-99');
            documentInput.setAttribute('maxlength', '18');
        } else {
            VMasker(cpfInput).maskPattern('999.999.999-99');
            cpfInput.setAttribute('maxlength', '14');
        }

        // Nova máscara para o telefone
        VMasker(telefoneInput).maskPattern('(99) 9 9999-9999');
        telefoneInput.setAttribute('maxlength', '16');
    }

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
            VMasker(telefoneInput).maskPattern('(99) 9 9999-9999');
            
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

    // Adicionar esta linha no final da função
    updateRequiredFields();
}

function setupFormValidation() {
    const form = document.getElementById('cadastroEmpresaForm');
    const radioButtons = document.querySelectorAll('input[name="documento"]');
    
    if (form) {
        // Adicionar evento de mudança para os radio buttons
        radioButtons.forEach(radio => {
            radio.addEventListener('change', updateRequiredFields);
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateForm()) {
                submitForm();
            }
        });
    }

    // Chamar a função inicialmente para configurar os campos corretamente
    updateRequiredFields();
}

function updateRequiredFields() {
    const documentType = document.querySelector('input[name="documento"]:checked').value;
    const cnpjField = document.getElementById('cnpj');
    const cpfField = document.getElementById('cpf');
    const razaoSocialField = document.getElementById('razao_social');

    if (documentType === 'cnpj') {
        cnpjField.required = true;
        cpfField.required = false;
        razaoSocialField.required = true;
        cnpjField.closest('.form-group').classList.remove('hidden');
        cpfField.closest('.form-group').classList.add('hidden');
        razaoSocialField.closest('.form-group').classList.remove('hidden');
    } else {
        cnpjField.required = false;
        cpfField.required = true;
        razaoSocialField.required = false;
        cnpjField.closest('.form-group').classList.add('hidden');
        cpfField.closest('.form-group').classList.remove('hidden');
        razaoSocialField.closest('.form-group').classList.add('hidden');
    }

    // Atualizar os asteriscos de campos obrigatórios
    updateRequiredAsterisks();
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('cadastroEmpresaForm');
    const requiredInputs = form.querySelectorAll('input[required]:not([type="radio"]):not(.hidden)');

    requiredInputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
            showError(input, 'Este campo é obrigatório');
        } else {
            clearError(input);
        }
    });

    // Validação específica para o select
    const selectTrigger = document.querySelector('.custom-select__trigger span');
    if (selectTrigger.textContent.trim() === '') {
        isValid = false;
        showError(selectTrigger.closest('.custom-select-wrapper'), 'Por favor, selecione um segmento');
    } else {
        clearError(selectTrigger.closest('.custom-select-wrapper'));
    }

    return isValid;
}

function showError(element, message) {
    const errorElement = element.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    } else {
        const newErrorElement = document.createElement('div');
        newErrorElement.className = 'error-message';
        newErrorElement.textContent = message;
        element.closest('.form-group').appendChild(newErrorElement);
    }
}

function clearError(element) {
    const errorElement = element.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function updateRequiredAsterisks() {
    const form = document.getElementById('cadastroEmpresaForm');
    const allInputs = form.querySelectorAll('input:not([type="radio"])');
    
    allInputs.forEach(input => {
        const label = input.closest('.form-group').querySelector('.floating-label');
        const asterisk = label.querySelector('.required');
        
        if (input.required && !input.closest('.form-group').classList.contains('hidden')) {
            if (!asterisk) {
                const newAsterisk = document.createElement('span');
                newAsterisk.className = 'required';
                newAsterisk.textContent = '*';
                label.appendChild(newAsterisk);
            }
        } else if (asterisk) {
            asterisk.remove();
        }
    });
}

function setupPasswordToggle() {
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Altera o ícone do olho
            const eyeIcon = this.querySelector('.eye-icon');
            if (type === 'password') {
                eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
            } else {
                eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
            }
        });
    });
}

const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmar_senha');
const senhaLabel = senhaInput.closest('.floating-input').querySelector('.floating-label');
const confirmarSenhaLabel = confirmarSenhaInput.closest('.floating-input').querySelector('.floating-label');
const senhaError = document.createElement('div');
senhaError.className = 'error-message';
confirmarSenhaInput.parentNode.appendChild(senhaError);

let senhaValue = '';
let confirmarSenhaValue = '';
let ambosPreenchidos = false;

function validatePassword() {
    if (ambosPreenchidos) {
        if (senhaValue === confirmarSenhaValue) {
            senhaError.textContent = '';
            confirmarSenhaInput.setCustomValidity('');
        } else {
            senhaError.textContent = 'As senhas não coincidem.';
            confirmarSenhaInput.setCustomValidity('As senhas não coincidem.');
        }
    } else {
        senhaError.textContent = '';
        confirmarSenhaInput.setCustomValidity('');
    }
}

function checkBothFilled() {
    ambosPreenchidos = senhaValue !== '' && confirmarSenhaValue !== '';
}

function applyNumericMask(input) {
    input.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove todos os não-dígitos
        value = value.slice(0, 5); // Limita a 5 dígitos
        
        // Armazena a posição do cursor
        const cursorPosition = this.selectionStart;
        
        // Atualiza o valor do input
        this.value = value;
        
        // Restaura a posição do cursor
        this.setSelectionRange(cursorPosition, cursorPosition);
    });
}

applyNumericMask(senhaInput);
applyNumericMask(confirmarSenhaInput);

senhaInput.addEventListener('blur', function() {
    senhaValue = this.value;
    checkBothFilled();
    validatePassword();
});

confirmarSenhaInput.addEventListener('blur', function() {
    confirmarSenhaValue = this.value;
    checkBothFilled();
    validatePassword();
});

// Atualizar os atributos dos campos de senha
senhaInput.setAttribute('type', 'password');
senhaInput.setAttribute('maxlength', '5');
senhaInput.setAttribute('inputmode', 'numeric');
senhaInput.setAttribute('pattern', '[0-9]{5}');

confirmarSenhaInput.setAttribute('type', 'password');
confirmarSenhaInput.setAttribute('maxlength', '5');
confirmarSenhaInput.setAttribute('inputmode', 'numeric');
confirmarSenhaInput.setAttribute('pattern', '[0-9]{5}');

function setupInputMasks() {
    const cnpjInput = document.getElementById('cnpj');
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');

    if (cnpjInput) {
        VMasker(cnpjInput).maskPattern('99.999.999/9999-99');
    }

    if (cpfInput) {
        VMasker(cpfInput).maskPattern('999.999.999-99');
    }

    if (telefoneInput) {
        VMasker(telefoneInput).maskPattern('(99) 9 9999-9999');
    }
}

function setupCNPJSearch() {
    const cnpjInput = document.getElementById('cnpj');
    const cnpjSearchButton = document.querySelector('.cnpj-search-button');

    if (cnpjInput && cnpjSearchButton) {
        cnpjSearchButton.addEventListener('click', searchCNPJ);
    }
}

async function searchCNPJ() {
    const cnpjInput = document.getElementById('cnpj');
    const cnpj = cnpjInput.value.replace(/\D/g, '');
    if (cnpj.length !== 14) {
        alert('Por favor, insira um CNPJ válido.');
        return;
    }

    const cnpjSearchButton = document.querySelector('.cnpj-search-button');
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
        document.getElementById('telefone').value = telefone;
        
        document.getElementById('email').value = data.estabelecimento.email || '';

        updateFloatingLabels();
    } catch (error) {
        alert('Erro ao buscar CNPJ: ' + error.message);
    } finally {
        cnpjSearchButton.classList.remove('loading');
    }
}

function updateFloatingLabels() {
    const floatingInputs = document.querySelectorAll('.floating-input input');
    floatingInputs.forEach(input => {
        const inputContainer = input.closest('.floating-input');
        inputContainer.classList.toggle('filled', input.value !== '');
    });
}