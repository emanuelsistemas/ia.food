document.addEventListener('DOMContentLoaded', function() {
    const select = document.querySelector('.custom-select');
    const selectTrigger = select.querySelector('.custom-select__trigger');
    const options = select.querySelectorAll('.custom-option');

    // Toggle open/close of select dropdown
    selectTrigger.addEventListener('click', () => {
        select.classList.toggle('open');
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
            if (!option.classList.contains('selected')) {
                option.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                option.classList.add('selected');
                selectTrigger.querySelector('span').textContent = option.textContent;
                select.classList.remove('open');
            }
        });
    }
});