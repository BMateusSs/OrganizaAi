document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.menu-button');
    const contents = document.querySelectorAll('.content');

    // Função principal para mudar a página
    const changePage = (pageId) => {
        // 1. Atualizar o estado dos botões de menu
        buttons.forEach((btn) => {
            btn.classList.remove('button-active');
            if (btn.getAttribute('data-page') === pageId) {
                btn.classList.add('button-active');
            }
        });

        // 2. Mostrar o conteúdo correto
        contents.forEach((content) => {
            content.classList.remove('content-block');
        });
        const content = document.getElementById(pageId);
        if (content) {
            content.classList.add('content-block');
        } else {
            // Opcional: Tratar caso a página não exista (ex: mostrar 404)
            console.error(`Página não encontrada: ${pageId}`);
        }
    };
    
    // Funcao para lidar com a navegação e o histórico
    const navigate = (pageId) => {
        // Sincroniza a URL sem recarregar a página
        // O segundo argumento é o título, o terceiro é a nova URL
        history.pushState({ page: pageId }, '', `#${pageId}`);
        changePage(pageId);
    };

    // Adicionar listeners de clique
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            navigate(pageId);
        });
    });

    // 3. Inicializar a página
    // Verifica a URL atual para carregar a página correta
    let initialPageId = window.location.hash.substring(1); // Remove o '#'
    if (!initialPageId || !document.getElementById(initialPageId)) {
        initialPageId = 'today'; // Define 'today' como padrão se a hash for vazia ou inválida
    }
    
    // Navega para a página inicial (sem adicionar um novo estado ao histórico)
    changePage(initialPageId);
    
    // Adicionar a hash à URL para a página inicial se não estiver lá
    if (window.location.hash.substring(1) !== initialPageId) {
        history.replaceState({ page: initialPageId }, '', `#${initialPageId}`);
    }
});