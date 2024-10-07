document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('.custom-select');
    const selectTrigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-option');
    const searchInput = select.querySelector('.search-input');
    const floatingLabel = select.querySelector('.floating-label');
    const defaultText = "Selecione seu segmento";

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
});