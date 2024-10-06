document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('.custom-select');
    const selectTrigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-option');
    const searchInput = select.querySelector('.search-input');
    const defaultText = "Selecione seu segmento";

    // Toggle open/close of select dropdown
    selectTrigger.addEventListener('click', () => {
        select.classList.toggle('open');
        if (select.classList.contains('open')) {
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
    for (const option of options) {
        option.addEventListener('click', () => {
            selectTrigger.querySelector('span').textContent = option.textContent;
            select.classList.remove('open');
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    }

    // Reset to default text if clicking on the trigger when an option is selected
    selectTrigger.addEventListener('click', () => {
        if (select.classList.contains('open') && selectTrigger.querySelector('span').textContent !== defaultText) {
            selectTrigger.querySelector('span').textContent = defaultText;
            options.forEach(opt => opt.classList.remove('selected'));
        }
    });

    // Search functionality
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
});