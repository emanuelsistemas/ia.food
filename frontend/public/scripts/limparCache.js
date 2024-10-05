function limparCache() {
    if (location.href.indexOf('?') === -1) {
        location.href = location.href + '?v=' + new Date().getTime();
    } else {
        location.href = location.href + '&v=' + new Date().getTime();
    }
}

// Adiciona um evento de tecla para limpar o cache
document.addEventListener('keydown', function(event) {
    // Verifica se as teclas Ctrl + F5 foram pressionadas
    if (event.ctrlKey && event.key === 'F5') {
        event.preventDefault(); // Previne o comportamento padrão
        limparCache();
    }
});

// Adiciona um parâmetro de versão a todos os links de recursos
document.addEventListener('DOMContentLoaded', function() {
    var links = document.getElementsByTagName('link');
    var scripts = document.getElementsByTagName('script');
    
    function adicionarVersao(elem) {
        var url = new URL(elem.href || elem.src, window.location.href);
        url.searchParams.set('v', new Date().getTime());
        if (elem.href) elem.href = url.href;
        if (elem.src) elem.src = url.href;
    }
    
    for (var i = 0; i < links.length; i++) adicionarVersao(links[i]);
    for (var i = 0; i < scripts.length; i++) adicionarVersao(scripts[i]);
});