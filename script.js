// Listas para almacenar datos de artículos y productos
const brands /* Lista de Marcas disponibles */ = [
    { name: 'Dog Chow', logo: 'assets/images/Dog Chow.png' },
    { name: 'Fancy Feast', logo: 'assets/images/Fancy Feast.png' },
    { name: 'Happy Paws', logo: 'assets/images/Happy Paws.png' }
];
const articles /* Lista de Artículos disponibles */ = [
    { id: 1, name: 'Alimento Seco para Perro Adulto', category: 'Alimentos', brand: 'Dog Chow', price: 102000, stock: 15, photo: 'assets/images/Alimento Seco para Perro Adulto.jpg' },
    { id: 2, name: 'Lata de Atún para Gato', category: 'Alimentos', brand: 'Fancy Feast', price: 11000, stock: 0, photo: 'assets/images/Lata de Atún para Gato.jpg' },
    { id: 3, name: 'Pelota de Goma Resistente', category: 'Juguetes', brand: 'Happy Paws', price: 32000, stock: 20, photo: 'assets/images/Pelota de Goma Resistente.jpg' },
    { id: 4, name: 'Collar de Cuero', category: 'Accesorios', brand: 'Happy Paws', price: 60000, stock: 5, photo: 'assets/images/Collar de Cuero.jpg' },
    { id: 5, name: 'Shampoo Antipulgas', category: 'Higiene y Cuidado', brand: 'Fancy Feast', price: 48800, stock: 0, photo: 'assets/images/Shampoo Antipulgas.jpeg' },
    { id: 6, name: 'Rascador para Gato', category: 'Accesorios', brand: 'Happy Paws', price: 120000, stock: 10, photo: 'assets/images/Rascador para Gatos.jpg' }
];
let cart = [];
const brandCardsContainer = document.getElementById("brandCardsContainer");
    const articleTableBody = document.getElementById("articleTableBody");
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("searchInput");
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotalContainer = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");

    // --- FUNCIONES DE RENDERIZADO ---

    const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-cart-message">El carrito está vacío.</p>`;
            checkoutBtn.disabled = true;
        } else {
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-details">
                        <p class="item-name">${item.name}</p>
                        <p class="item-subtotal">${formatCurrency(item.price)} x ${item.quantity} = ${formatCurrency(item.price * item.quantity)}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button data-id="${item.id}" class="cart-quantity-change">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" class="cart-quantity-change">+</button>
                        <button data-id="${item.id}" class="cart-remove-item">X</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
            checkoutBtn.disabled = false;
        }
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalContainer.innerHTML = `<span>Total: ${formatCurrency(total)}</span>`;
    }

    function renderArticles(filter = '') {
        articleTableBody.innerHTML = "";
        const filteredArticles = articles.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));

        if (filteredArticles.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" style="text-align: center;">No se encontraron artículos.</td>`;
            articleTableBody.appendChild(row);
            return;
        }

        filteredArticles.forEach(article => {
            const row = document.createElement("tr");
            const isOutOfStock = article.stock === 0;
            
            if(isOutOfStock) {
                row.classList.add('out-of-stock-row');
            }

            const actionCellContent = isOutOfStock
                ? `<span class="status-tag">Agotado</span>`
                : `<button data-id="${article.id}" class="add-to-cart-btn">Agregar</button>`;

            row.innerHTML = `
                <td><img src="${article.photo}" alt="${article.name}" onerror="this.onerror=null;this.src='https://placehold.co/50x50/e2e8f0/94a3b8?text=Foto';"></td>
                <td>${article.name}</td>
                <td>${article.category}</td>
                <td>${article.brand}</td>
                <td>${formatCurrency(article.price)}</td>
                <td>${actionCellContent}</td>
            `;
            articleTableBody.appendChild(row);
        });
    }
    
    // Cambiamos el nombre de la función para mayor claridad
    function renderBrands() {
        brandCardsContainer.innerHTML = "";
        brands.forEach(brand => {
            const card = document.createElement("div");
            // Usamos la clase 'brand-card' que definimos en el CSS
            card.className = "brand-card";
            card.innerHTML = `
                <img src="${brand.logo}" alt="Logo de ${brand.name}" onerror="this.onerror=null;this.src='https://placehold.co/100x100/e2e8f0/94a3b8?text=Logo';">
                <h3>${brand.name}</h3>
            `;
            brandCardsContainer.appendChild(card);
        });
    }
    
    // --- LÓGICA DEL CARRITO ---
    function addToCart(articleId) {
        const articleToAdd = articles.find(a => a.id === articleId);

        if (!articleToAdd || articleToAdd.stock === 0) return;
        
        const existingItem = cart.find(item => item.id === articleId);
        if (existingItem) {
            if (existingItem.quantity < articleToAdd.stock) {
                existingItem.quantity++;
            } else {
                alert(`No puedes agregar más unidades de este producto. Stock disponible: ${articleToAdd.stock}`);
            }
        } else {
            cart.push({ ...articleToAdd, quantity: 1 });
        }
        renderCart();
    }

    function handleCartChange(articleId, change) {
        const itemInCart = cart.find(item => item.id === articleId);
        if (!itemInCart) return;

        const articleInCatalog = articles.find(a => a.id === articleId);

        if (change === 'remove' || (change === 'decrease' && itemInCart.quantity === 1)) {
            cart = cart.filter(item => item.id !== articleId);
        } else if (change === 'decrease') {
            itemInCart.quantity--;
        } else if (change === 'increase') {
            if (itemInCart.quantity < articleInCatalog.stock) {
                itemInCart.quantity++;
            } else {
                alert(`No puedes agregar más unidades de este producto. Stock disponible: ${articleInCatalog.stock}`);
            }
        }
        renderCart();
    }

    // --- MANEJADORES DE EVENTOS ---
    articleTableBody.addEventListener('click', e => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const articleId = parseInt(e.target.dataset.id);
            addToCart(articleId);
        }
    });

    cartItemsContainer.addEventListener('click', e => {
        if (e.target.dataset.id) {
            const articleId = parseInt(e.target.dataset.id);
            let change;
            if (e.target.classList.contains('cart-remove-item')) {
                change = 'remove';
                    handleCartChange(articleId, change);
            } else if(e.target.classList.contains('cart-quantity-change')) {
                change = e.target.textContent === '+' ? 'increase' : 'decrease';
                    handleCartChange(articleId, change);
            }
        }
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    searchInput.addEventListener("input", e => renderArticles(e.target.value));
    
    checkoutBtn.addEventListener('click', () => {
        if(cart.length > 0) {
            alert('¡Gracias por tu compra!');
            cart = [];
            renderCart();
        }
    });

    // --- INICIALIZACIÓN ---
    function initialize() {
        renderBrands();
        renderArticles();
        renderCart();
    }

    initialize();
;