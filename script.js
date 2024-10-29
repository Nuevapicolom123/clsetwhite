let users = []; // Arreglo para almacenar los usuarios registrados
let currentUserType = null; // Variable para almacenar el tipo de usuario
let sellerProducts = []; // Arreglo para almacenar productos de vendedores
let orders = []; // Arreglo para almacenar los pedidos
let sellerRatings = []; // Arreglo para almacenar las calificaciones de los vendedores

function showRegister() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('register').classList.remove('hidden');
    document.getElementById('login').classList.add('hidden');
    document.getElementById('buyer-interface').classList.add('hidden');
    document.getElementById('seller-interface').classList.add('hidden');
}

function showLogin() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('register').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('buyer-interface').classList.add('hidden');
    document.getElementById('seller-interface').classList.add('hidden');
}

function register(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    // Almacena el nuevo usuario en el arreglo
    users.push({ name, email, phone, username, password, userType });
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    showLogin();
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Busca al usuario en el arreglo de usuarios
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        currentUserType = user.userType; // Establece el tipo de usuario
        if (currentUserType === "buyer") {
            showBuyerInterface();
        } else if (currentUserType === "seller") {
            showSellerInterface();
        }
    } else {
        alert("Credenciales incorrectas. Intenta nuevamente.");
    }
}

function showBuyerInterface() {
    document.getElementById('buyer-interface').classList.remove('hidden');
    document.getElementById('auth-container').classList.add('hidden');
    displayCatalog(); // Muestra el catálogo de productos
}

function showSellerInterface() {
    document.getElementById('seller-interface').classList.remove('hidden');
    document.getElementById('auth-container').classList.add('hidden');
    displayProducts(); // Muestra los productos del vendedor
    displayOrders(); // Muestra los pedidos del vendedor
    displayRatings(); // Muestra las calificaciones del vendedor
}

function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Limpia la lista actual
    sellerProducts.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width:100px;height:100px;">
                                 <strong>${product.name}</strong> - S/${product.price} 
                                 <button onclick="removeProduct(${index})">Eliminar</button>`;
        productList.appendChild(productItem);
    });
}

function displayCatalog() {
    const catalogList = document.getElementById('catalog-list');
    catalogList.innerHTML = ''; // Limpia la lista actual
    sellerProducts.forEach((product, index) => {
        const catalogItem = document.createElement('div');
        catalogItem.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width:100px;height:100px;">
                                 <strong>${product.name}</strong> - S/${product.price} 
                                 <button onclick="viewProduct(${index})">Comprar</button>`;
        catalogList.appendChild(catalogItem);
    });
}

function viewProduct(index) {
    const product = sellerProducts[index];
    const productDetail = document.getElementById('product-detail');
    productDetail.innerHTML = `
        <h3>${product.name}</h3>
        <img src="${product.image}" alt="${product.name}" style="width:200px;height:200px;">
        <p>Precio: S/${product.price}</p>
        <p>Tienda: ${users.find(user => user.userType === "seller").name}</p>
        <button onclick="startChat()">Chatear con el vendedor</button>
        <button onclick="showPaymentOptions(${index})">Ir a Pagar</button>
    `;
    productDetail.classList.remove('hidden');
}

function showPaymentOptions(index) {
    const product = sellerProducts[index];
    const paymentOptions = document.createElement('div');
    paymentOptions.innerHTML = `
        <h4>Opciones de Pago</h4>
        <button onclick="processPayment('efectivo', ${product.price}, '${product.name}')">Efectivo</button>
        <button onclick="processPayment('tarjeta', ${product.price}, '${product.name}')">Tarjeta</button>
        <button onclick="cancelPayment()">Cancelar</button>
    `;
    const productDetail = document.getElementById('product-detail');
    productDetail.appendChild(paymentOptions);
}

function processPayment(method, amount, productName) {
    const order = { product: productName, status: "Pedido Pendiente" };
    orders.push(order); // Agrega el pedido a la lista de órdenes
    alert(`Gracias por tu compra de S/${amount} usando ${method}.`);
    document.getElementById('product-detail').classList.add('hidden');
    displayOrderStatus(order); // Muestra el estatus del pedido
}

function cancelPayment() {
    document.getElementById('product-detail').classList.add('hidden');
}

function displayOrderStatus(order) {
    const orderStatus = document.getElementById('order-status');
    orderStatus.innerHTML = `
        <h4>Pedido Realizado</h4>
        <p>Producto: ${order.product}</p>
        <p>Estatus: ${order.status}</p>
        <button onclick="rateSeller()">Calificar al Vendedor</button>
    `;
    orderStatus.classList.remove('hidden');
}

function rateSeller() {
    const rating = prompt("Califica al vendedor con 1-5 estrellas:");
    if (rating >= 1 && rating <= 5) {
        alert(`Gracias por calificar con ${rating} estrellas.`);
        sellerRatings.push({ rating: parseInt(rating) }); // Agrega la calificación al vendedor
        displayRatings(); // Actualiza la visualización de calificaciones
    } else {
        alert("Por favor, introduce un número válido entre 1 y 5.");
    }
}

function displayRatings() {
    const ratingsList = document.getElementById('ratings-list');
    ratingsList.innerHTML = ''; // Limpia la lista actual
    sellerRatings.forEach(rating => {
        const ratingItem = document.createElement('div');
        ratingItem.innerHTML = `<strong>Calificación:</strong> ${rating.rating} estrellas`;
        ratingsList.appendChild(ratingItem);
    });
}

function addProduct() {
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productImage = document.getElementById('product-image').files[0];

    const reader = new FileReader();
    reader.onload = function(event) {
        sellerProducts.push({ name: productName, price: productPrice, image: event.target.result }); // Agrega el nuevo producto
        displayProducts(); // Muestra los productos actualizados
        displayCatalog(); // Muestra el producto en el catálogo de compradores
    };
    reader.readAsDataURL(productImage);

    hideAddProduct(); // Oculta el formulario
    document.getElementById('product-name').value = ''; // Limpia el campo
    document.getElementById('product-price').value = ''; // Limpia el campo
    document.getElementById('product-image').value = ''; // Limpia el campo
}

function showAddProduct() {
    document.getElementById('add-product-form').classList.remove('hidden');
}

function hideAddProduct() {
    document.getElementById('add-product-form').classList.add('hidden');
}

function removeProduct(index) {
    sellerProducts.splice(index, 1); // Elimina el producto del arreglo
    displayProducts(); // Muestra los productos actualizados
    displayCatalog(); // Actualiza el catálogo de compradores
}

function displayOrders() {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = ''; // Limpia la lista actual
    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `
            <strong>Producto:</strong> ${order.product} - <strong>Estatus:</strong> ${order.status}
            <button onclick="markAsDelivered('${order.product}')">Marcar como Entregado</button>
        `;
        orderList.appendChild(orderItem);
    });
}

function markAsDelivered(product) {
    const order = orders.find(o => o.product === product);
    if (order) {
        order.status = "Pedido Entregado"; // Actualiza el estado del pedido
        alert(`El pedido de ${product} ha sido marcado como entregado.`);
        displayOrders(); // Actualiza la lista de pedidos
        updateOrderStatusInBuyer(product); // Actualiza el estado del pedido en la interfaz del comprador
    }
}

function updateOrderStatusInBuyer(product) {
    const order = orders.find(o => o.product === product);
    if (order) {
        const orderStatus = document.getElementById('order-status');
        orderStatus.innerHTML = `
            <h4>Pedido Actualizado</h4>
            <p>Producto: ${order.product}</p>
            <p>Estatus: ${order.status}</p>
        `;
    }
}

function startChat() {
    alert("Funcionalidad de chat no implementada aún.");
}

function logout() {
    currentUserType = null;
    showLogin();
}