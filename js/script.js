document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MODO ESCURO ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn.querySelector('i');
    const savedTheme = localStorage.getItem('rosy_theme');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            if (body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('rosy_theme', 'dark');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('rosy_theme', 'light');
            }
        });
    }

    // --- 2. JSON DE PRODUTOS (IMAGENS LOCAIS .PNG) ---
    const produtos = [
        { 
            id: 1, 
            nome: "Vestido Floral Primavera", 
            categoria: "vestidos", 
            precoOriginal: 249.90, 
            precoAtual: 149.90, 
            // Imagem local
            imagem: "imagens/prod-vestido-floral.png", 
            destaque: true, 
            tags: ["Novo", "-40%"] 
        },
        { 
            id: 2, 
            nome: "Blusa Elegante Off-White", 
            categoria: "blusas", 
            precoOriginal: 129.90, 
            precoAtual: 89.90, 
            // Imagem local
            imagem: "imagens/prod-blusa-white.png", 
            destaque: true, 
            tags: ["-31%"] 
        },
        { 
            id: 3, 
            nome: "Conjunto Casual Chic", 
            categoria: "conjuntos", 
            precoOriginal: null, 
            precoAtual: 179.90, 
            // Imagem local
            imagem: "imagens/prod-conjunto.png", 
            destaque: true, 
            tags: ["Novo"] 
        },
        { 
            id: 4, 
            nome: "Saia Midi Plissada", 
            categoria: "saias", 
            precoOriginal: 189.90, 
            precoAtual: 119.90, 
            // Imagem local
            imagem: "imagens/prod-saia-plissada.png", 
            destaque: true, 
            tags: ["-37%"] 
        },
        { 
            id: 5, 
            nome: "Calça Social Alfaiataria", 
            categoria: "calcas", 
            precoOriginal: null, 
            precoAtual: 159.90, 
            // Reutilizando uma imagem local existente (ex: conjunto) já que não tinha uma específica de calça no print
            imagem: "imagens/prod-conjunto.png",
            destaque: false, 
            tags: [] 
        },
        { 
            id: 6, 
            nome: "Vestido Longo Festa", 
            categoria: "vestidos", 
            precoOriginal: 399.90, 
            precoAtual: 299.90, 
            // Imagem local com o nome exato do seu print ("rod" em vez de "prod")
            imagem: "imagens/rod-vestido-longo.png", 
            destaque: false, 
            tags: ["Luxo"] 
        }
    ];

    // --- 3. RENDERIZAR PRODUTOS ---
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        const pageTitle = document.title;
        const produtosParaExibir = pageTitle.includes("Coleção") ? produtos : produtos.filter(p => p.destaque === true);
        
        productsContainer.innerHTML = ''; 
        produtosParaExibir.forEach(produto => {
            let tagsHTML = '';
            produto.tags.forEach(tag => {
                let classe = tag.includes('%') ? 'tag-discount' : 'tag-new';
                tagsHTML += `<span class="${classe}">${tag}</span>`;
            });
            let precoHTML = produto.precoOriginal ? `<span class="new-price">R$ ${produto.precoAtual.toFixed(2).replace('.', ',')}</span><span class="old-price">R$ ${produto.precoOriginal.toFixed(2).replace('.', ',')}</span>` : `<span class="new-price">R$ ${produto.precoAtual.toFixed(2).replace('.', ',')}</span>`;
            
            productsContainer.innerHTML += `
                <div class="product-card" data-category="${produto.categoria}">
                    <div class="prod-img">${tagsHTML}<img src="${produto.imagem}" alt="${produto.nome}"></div>
                    <div class="prod-details"><span class="prod-cat">${produto.categoria}</span><h4>${produto.nome}</h4><div class="price">${precoHTML}</div></div>
                </div>`;
        });
    }

    // --- 4. FILTROS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const categoryToFilter = button.innerText.trim().toLowerCase();
                document.querySelectorAll('.product-card').forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (categoryToFilter === 'todos' || cardCat === categoryToFilter) {
                        card.style.display = 'block'; card.style.animation = 'fadeIn 0.5s ease';
                    } else { card.style.display = 'none'; }
                });
            });
        });
    }

    // --- 5. VALIDAÇÃO DE FORMULÁRIO ---
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            let isValid = true;
            form.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!input.value.trim()) { isValid = false; input.style.borderColor = 'red'; } 
                else { input.style.borderColor = ''; } // Reseta a cor da borda
            });
            if (isValid) {
                let textoSucesso = "Sucesso! Sua mensagem foi enviada.";
                if (window.location.pathname.includes('cadastro') || document.title.includes("Cadastre-se")) { textoSucesso = "Sucesso! Seu cadastro foi realizado. Bem-vinda ao Clube Rosy!"; }
                
                const msgDiv = document.createElement('div');
                msgDiv.innerHTML = `<div style="background-color: #d1fae5; color: #065f46; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; border: 1px solid #34d399;"><i class="fa-solid fa-check-circle"></i> ${textoSucesso}</div>`;
                form.parentNode.appendChild(msgDiv);
                setTimeout(() => { msgDiv.remove(); }, 5000);
                form.reset();
            } else { alert("Por favor, preencha todos os campos obrigatórios."); }
        });
    });
});

// --- 6. MÁSCARA TELEFONE ---
function mascaraTelefone(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) value = `${value.slice(0, 9)}-${value.slice(9)}`;
    input.value = value;
}

const style = document.createElement('style');
style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);