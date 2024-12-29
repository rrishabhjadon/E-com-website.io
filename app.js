// DOM Elements
const cart = document.querySelector("nav .cart");
const cartSideBar = document.querySelector(".cart-sidebar");
const closeCart = document.querySelector(".close-cart");
const productList = document.getElementById("product-list");
const cartItemsTotal = document.querySelector(".noi");
const cartPriceTotal = document.querySelector(".total-amount");
const cartContent = document.querySelector(".cart-content");
const clearBtn = document.querySelector(".clear-cart-btn");
const menuButton = document.querySelector(".burger");
const menuSidebar = document.querySelector(".menu-sidebar");
const closeMenu = document.querySelector(".close-menu");

// Empty cart array to hold the items added to the cart
let Cart = [];
let buttonsDOM = [];
// Event listener to open the menu sidebar when the burger menu is clicked
menuButton.addEventListener("click", function () {
    menuSidebar.style.transform = "translate(0%)";
    document.querySelector(".overlay").style.display = "block";
});

// Add event listener to the login link in the mobile menu
document.querySelector('.menu-list-items a[href="#login"]').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    openModal(); // Open the modal
    showLoginForm(); // Show the login form
});

// Event listener to close the menu sidebar when the close button is clicked
closeMenu.addEventListener("click", function () {
    menuSidebar.style.transform = "translate(-100%)";
    document.querySelector(".overlay").style.display = "none";
});
// Product data: Each product has an id, title, price, and image
const products = [
    { id: "1", title: "Python Programming", price: 499, image: "Assets/python.jpg" },
    { id: "2", title: "C Programming", price: 549, image: "Assets/c.jpeg" },
    { id: "3", title: "C++ Programming", price: 549, image: "Assets/c++.png" },
    { id: "4", title: "PHP Programming", price: 799, image: "Assets/phplogo.jpg" },
    { id: "5", title: "JAVA Programming", price: 1099, image: "Assets/java.jpg" },
    { id: "6", title: "Web Development for Beginners", price: 899, image: "Assets/web.jpg" },
    { id: "7", title: "MySQL", price: 699, image: "Assets/mysql.jpg" },
    { id: "8", title: "DSA", price: 1199, image: "Assets/dsa.png" },
    { id: "9", title: "Artificial Intelligence(A.I.)", price: 999, image: "Assets/ai.jpeg" }
];
// Event listener to open the cart sidebar when the cart button is clicked
cart.addEventListener("click", function () {
    cartSideBar.style.transform = "translate(0%)";
    document.querySelector(".overlay").style.display = "block";
});
// Event listener to close the cart sidebar when the close button is clicked
closeCart.addEventListener("click", function () {
    cartSideBar.style.transform = "translate(100%)";
    document.querySelector(".overlay").style.display = "none";
});
// UI class handles the UI interactions related to products, cart, and buttons
class UI {
    // Display all products on the page
    displayProducts(products) {
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-card");
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3 class="product-name">${product.title}</h3>
                <div class="product-pricing">₹${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>`;
            productList.append(productDiv);
        });
    }
    // Get references to all "Add to Cart" buttons and add event listeners to them
    getButtons() {
        const btns = document.querySelectorAll(".add-to-cart");
        buttonsDOM = [...btns];
        btns.forEach((btn) => {
            let id = btn.dataset.id;
            let inCart = Cart.find((item) => item.id === id);
            if (inCart) {
                btn.innerHTML = "In Cart";
                btn.disabled = true;
            }
            // Add event listener to each "Add to Cart" button
            btn.addEventListener("click", (e) => {
                e.currentTarget.innerHTML = "In Cart";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.pointerEvents = "none";
                let cartItem = { ...this.getProductById(id), amount: 1 };
                Cart.push(cartItem);
                this.setCartValues(Cart);
                this.addCartItem(cartItem);
            });
        });
    }
 // Find a product by its ID
    getProductById(id) {
        return products.find(product => product.id === id);
    }
// Set and update cart values (total price and item count)
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartItemsTotal.innerHTML = itemsTotal;
        cartPriceTotal.innerHTML = parseFloat(tempTotal.toFixed(2));
    }
 // Add a new cart item to the UI
    addCartItem(cartItem) {
        let cartItemUi = document.createElement("div");
        cartItemUi.classList.add("cart-product");
        cartItemUi.innerHTML = `
            <div class="product-image">
                <img src="${cartItem.image}" alt="${cartItem.title}">
            </div>
            <div class="cart-product-content">
                <div class="cart-product-name"><h3>${cartItem.title}</h3></div>
                <div class="cart-product-price"><h3>₹${cartItem.price.toFixed(2)}</h3></div>
                <div class="cart-product-remove" data-id="${cartItem.id}" style="color:red; cursor:pointer">Remove</div>
            </div>
            <div class="plus-minus">
                <i class="fa fa-plus add-amount" data-id="${cartItem.id}"></i>
                <span class="no-of-items">${cartItem.amount}</span>
                <i class="fa fa-minus reduce-amount" data-id="${cartItem.id}"></i>
            </div>`;
        cartContent.append(cartItemUi);
    }
// Set up the app on page load
    setupApp() {
        this.setCartValues(Cart);
        Cart.map((item) => {
            this.addCartItem(item);
        });
    }
// Cart-related logic: handling item removal, quantity adjustment, and cart clearing
    cartLogic() {
        clearBtn.addEventListener("click", () => {
            this.clearCart();
        });
// Event listener to handle clicks on cart items (remove, plus, or minus)
        cartContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("cart-product-remove")) {
                let id = event.target.dataset.id;
                this.removeItem(id);
                let div = event.target.closest(".cart-product");
                div.remove();
            } else if (event.target.classList.contains("add-amount")) {
                let id = event.target.dataset.id;
                let item = Cart.find((item) => item.id === id);
                item.amount++;
                this.setCartValues(Cart);
                event.target.nextElementSibling.innerHTML = item.amount;
            } else if (event.target.classList.contains("reduce-amount")) {
                let id = event.target.dataset.id;
                let item = Cart.find((item) => item.id === id);
                if (item.amount > 1) {
                    item.amount--;
                    this.setCartValues(Cart);
                    event.target.previousElementSibling.innerHTML = item.amount;
                } else {
                    this.removeItem(id);
                    let div = event.target.closest(".cart-product");
                    div.remove();
                }
            }
        });
    }
 // Clear the entire cart
    clearCart() {
        let cartItems = Cart.map(item => item.id);
        cartItems.forEach((id) => this.removeItem(id));
        const cartProducts = document.querySelectorAll(".cart-product");
        cartProducts.forEach((item) => {
            if (item) {
                item.parentElement.removeChild(item);
            }
        });
    }
 // Remove the product from cart
    removeItem(id) {
        Cart = Cart.filter((item) => item.id !== id);
        this.setCartValues(Cart);
        let button = this.getSingleButton(id);
        button.style.pointerEvents = "unset";
        button.innerHTML = `<i class="fa fa-cart-plus"></i> Add To Cart`;
        button.disabled = false;
    }
// Add product to cart
    getSingleButton(id) {
        return document.querySelector(`.add-to-cart[data-id='${id}']`);
    }   
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    ui.setupApp();
    ui.displayProducts(products);
    ui.getButtons();
    ui.cartLogic();
});

    // Function to open the modal
    function openModal() {
        document.getElementById('authModal').style.display = 'block';
    }

    // Function to close the modal
    function closeModal() {
        document.getElementById('authModal').style.display = 'none';
    }

    // Function to show the login form
    function showLoginForm() {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    }

    // Function to show the register form
    function showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    }

    // // Add event listener to the login link
    // document.querySelector('.menubar .list-items a[href="#login"]').addEventListener('click', function(event) {
    //     event.preventDefault();
    //     openModal(); 
    //     showLoginForm(); 
    // });

    // Add event listener to the mobile menu items
document.querySelectorAll('.menu-list-items a').forEach(item => {
    item.addEventListener('click', function(event) {
        // Close the menu sidebar after clicking
        menuSidebar.style.transform = "translate(-100%)";
        document.querySelector(".overlay").style.display = "none";
    });
});