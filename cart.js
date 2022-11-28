import items from "./items.json";
import formatCurrency from "./formatCurrency";

const cartButton = document.querySelector("[data-cart-button]");
const cartWrapper = document.querySelector("[data-cart-wrapper]");
const cartContainer = document.querySelector("[data-cart-container]");
let cart = [];
const cartItemTemplate = document.querySelector("#cart-item-template");
const cartQuantityIndicator = document.querySelector(
    "[data-cart-quantity-indicator]"
);
const IMAGE_URL = "https://dummyimage.com/210x130";
const cartTotal = document.querySelector("[data-cart-total]");
const cartSection = document.querySelector("[data-cart]");
const SESSION_STORAGE_KEY = "SHOPPING_CART_currentCart";

export function setupCart() {
    // Removes the item from cart when remove button clicked
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-remove-from-cart-button]")) {
            // Fetch the ID of item to be removed
            const id = parseInt(
                e.target.closest("[data-cart-item]").dataset.id
            );
            // Send the ID as parameter for removing
            removeFromCart(id);
        }
    });

    // Reload cart array and render again
    cart = loadCartFromStorage();
    renderCart();

    // Make the cart invisible when clicked on cart button
    cartButton.addEventListener("click", () => {
        cartWrapper.classList.toggle("invisible");
    });
}

// Saves the cart into session storage
function saveCartToStorage() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cart));
}

// Loads the cart from session storage
function loadCartFromStorage() {
    hideCart();
    // Return saved cart, if no saved cart was found return an empty array just like cart variable
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) || [];
}

export function addToCart(id) {
    // Check cart if same item was added again. If so, increase quantity of found item.
    const multipleSameItem = cart.find((entry) => entry.id === id);
    if (multipleSameItem) {
        multipleSameItem.quantity++;
    } else {
        // Item added into cart array for the first time.
        cart.push({ id: id, quantity: 1 });
    }
    // Update shown cart for the end user
    renderCart();
    saveCartToStorage();
}

function removeFromCart(id) {
    const existingItem = cart.find((entry) => entry.id === id);
    if (existingItem == null) return; //Failsafe for just in case
    // Make a copy of "cart" which only includes items that dont have same ID as item to be removed
    cart = cart.filter((entry) => entry.id !== id);
    // Update shown cart
    renderCart();
    saveCartToStorage();
}

function renderCart() {
    if (cart.length === 0) {
        hideCart();
    } else {
        showCart();
        renderCartItems();
    }
}

function hideCart() {
    cartSection.classList.add("invisible");
    cartWrapper.classList.add("invisible");
}

function showCart() {
    cartSection.classList.remove("invisible");
}

function renderCartItems() {
    // Shows number of items on cart button
    cartQuantityIndicator.textContent = cart.length;

    const totalCents = cart.reduce((sum, entry) => {
        // Find item's ID in DB which also is in cart
        const item = items.find((i) => entry.id === i.id);
        // Take item's price from DB and multiply by quantity of the item in cart
        return sum + item.priceCents * entry.quantity;
    }, 0);

    // Formatting cart total text
    cartTotal.textContent = formatCurrency(totalCents / 100);

    // Clear items for another re-rendering
    cartContainer.innerHTML = "";

    cart.forEach((entry) => {
        // Match the item in the cart with the item in DB
        const item = items.find((i) => entry.id === i.id);
        const cartItem = cartItemTemplate.content.cloneNode(true);

        const container = cartItem.querySelector("[data-cart-item]");
        container.dataset.id = item.id;

        const name = cartItem.querySelector("[data-cart-item-name]");
        name.textContent = item.name;

        const image = cartItem.querySelector("[data-cart-item-img]");
        image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

        // Show quantity only if more than 1 piece
        if (entry.quantity > 1) {
            const quantity = cartItem.querySelector(
                "[data-cart-item-quantity]"
            );
            quantity.textContent = `x${entry.quantity}`;
        }

        const price = cartItem.querySelector("[data-cart-item-price]");
        price.textContent = formatCurrency(
            (item.priceCents * entry.quantity) / 100
        );

        cartContainer.appendChild(cartItem);
    });
}
