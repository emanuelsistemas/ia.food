document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const subcategorySelect = document.getElementById('subcategory');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateSubcategories(this.textContent);
        });
    });

    function updateSubcategories(category) {
        // Limpar opções existentes
        subcategorySelect.innerHTML = '<option value="" disabled selected>Choose a subcategory</option>';

        // Adicionar novas opções baseadas na categoria selecionada
        let options;
        switch(category) {
            case 'Technical':
                options = ['Hardware', 'Software', 'Network'];
                break;
            case 'Accounting':
                options = ['Invoicing', 'Payroll', 'Taxes'];
                break;
            case 'Miscellaneous':
                options = ['General Inquiry', 'Feedback', 'Other'];
                break;
        }

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase();
            optionElement.textContent = option;
            subcategorySelect.appendChild(optionElement);
        });
    }

    const select = document.getElementById('subcategory');
    let isOpen = false;

    select.addEventListener('mousedown', function() {
        isOpen = !isOpen;
        if (isOpen) {
            this.classList.add('options-visible');
        } else {
            this.classList.remove('options-visible');
        }
    });

    select.addEventListener('blur', function() {
        isOpen = false;
        this.classList.remove('options-visible');
    });

    select.addEventListener('change', function() {
        isOpen = false;
        this.classList.remove('options-visible');
    });
});