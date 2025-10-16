// Basic JavaScript for Diwali Crackers website

document.addEventListener('DOMContentLoaded', function() {
    console.log('Diwali Crackers website loaded');

    // Quantity button handlers for products
    const productQtyBtns = document.querySelectorAll('.quantity-selector .qty-btn');
    productQtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const input = this.parentNode.querySelector('.qty-input');
            let value = parseInt(input.value);
            if (action === 'plus') {
                value++;
            } else if (action === 'minus' && value > 0) {
                value--;
            }
            input.value = value;
        });
    });

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const unitPrice = parseFloat(priceText.replace('₹', '').split(' ')[0]);
            const quantity = parseInt(this.parentNode.querySelector('.qty-input').value);
            
            if (quantity > 0) {
                // Get existing cart from localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if product already in cart
                const existingIndex = cart.findIndex(item => item.product === product);
                if (existingIndex >= 0) {
                    cart[existingIndex].quantity += quantity;
                } else {
                    cart.push({product, quantity, unitPrice});
                }
                
                // Save back to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Reset quantity to 0
                this.parentNode.querySelector('.qty-input').value = 0;
                
                alert(`Added ${quantity} x ${product} to cart for ₹${unitPrice * quantity}`);
            } else {
                alert('Please select a quantity greater than 0');
            }
        });
    });

    // Mobile menu toggle (if needed)
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }



    // Place Order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            document.getElementById('order-form').style.display = 'block';
        });
    }

    // Load cart if on cart page
    if (document.getElementById('cart-items')) {
        loadCart();
    }

    function loadCart() {
        const cartItemsDiv = document.getElementById('cart-items');
        const emptyCartDiv = document.getElementById('empty-cart');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartItemsDiv.style.display = 'none';
            emptyCartDiv.style.display = 'block';
            document.querySelector('.cart-summary').style.display = 'none';
            document.querySelector('.order-form').style.display = 'none';
            return;
        }
        
        cartItemsDiv.innerHTML = '';
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="https://picsum.photos/300/220?random=${index + 1}" alt="${item.product}">
                <div class="item-details">
                    <h3>${item.product}</h3>
                    <p>₹${item.unitPrice} per item</p>
                </div>
                <div class="quantity">
                    <button class="qty-btn" data-index="${index}" data-action="minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="qty-btn" data-index="${index}" data-action="plus">+</button>
                </div>
                <div class="item-total">₹${item.unitPrice * item.quantity}</div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
        });
        
        emptyCartDiv.style.display = 'none';
        cartItemsDiv.style.display = 'block';
        updateTotal();
    }

    function updateTotal() {
        let subtotal = 0;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.forEach(item => {
            subtotal += item.unitPrice * item.quantity;
        });
        const delivery = 50;
        const total = subtotal + delivery;
        
        const subtotalSpan = document.querySelector('.cart-summary .summary-row:nth-child(1) span:nth-child(2)');
        const totalSpan = document.querySelector('.cart-summary .summary-row.total span:nth-child(2)');
        
        if (subtotalSpan) subtotalSpan.textContent = `₹${subtotal}`;
        if (totalSpan) totalSpan.textContent = `₹${total}`;
    }

    // Event delegation for cart item buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn') && e.target.closest('#cart-items')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const action = e.target.getAttribute('data-action');
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (action === 'plus') {
                cart[index].quantity++;
            } else if (action === 'minus' && cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
        
        if (e.target.classList.contains('remove-btn') && e.target.closest('#cart-items')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
        }
    });

    // Form submission handling (adapted from main2.js)
    const forms = document.querySelectorAll('.booking-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Here you would typically send the data to a server
            // For now, we'll just log it and show a confirmation
            console.log('Order data:', data);
            alert('Order confirmed successfully! We will contact you soon for payment and delivery details.');

            // Reset the form
            form.reset();
            // Optionally, clear the cart
            localStorage.removeItem('cart');
            loadCart();
        });
    });

    // Category filter
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const selectedCategory = this.value;
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
                if (selectedCategory === 'all' || product.getAttribute('data-category') === selectedCategory) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
});
