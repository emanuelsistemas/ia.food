document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('empresaForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const empresaData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/empresa/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(empresaData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Cadastro realizado com sucesso:', result);
                alert('Cadastro realizado com sucesso!');
                form.reset();
            } else {
                const errorData = await response.json();
                console.error('Erro no cadastro:', errorData);
                alert(`Erro no cadastro: ${errorData.message || 'Ocorreu um erro desconhecido.'}`);
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        }
    });

    // Adicione aqui outras funcionalidades como validação de campos, 
    // máscara para telefone e documento, etc.
});