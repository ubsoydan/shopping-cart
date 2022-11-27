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
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-remove-from-cart-button]")) {
            const id = parseInt(
                e.target.closest("[data-cart-item]").dataset.id
            );
            removeFromCart(id);
        }
    });
    cart = loadCartFromStorage();
    renderCart();

    cartButton.addEventListener("click", () => {
        cartWrapper.classList.toggle("invisible");
    });
}

function saveCartToStorage() {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cart));
}

function loadCartFromStorage() {
    hideCart();
    return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY)) || [];
}

export function addToCart(id) {
    const multipleSameItem = cart.find((entry) => entry.id === id);
    if (multipleSameItem) {
        multipleSameItem.quantity++;
    } else {
        cart.push({ id: id, quantity: 1 });
    }
    renderCart();
    saveCartToStorage();
}

function removeFromCart(id) {
    const existingItem = cart.find((entry) => entry.id === id);
    if (existingItem == null) return;
    cart = cart.filter((entry) => entry.id !== id);
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
    cartQuantityIndicator.textContent = cart.length;

    const totalCents = cart.reduce((sum, entry) => {
        const item = items.find((i) => entry.id === i.id);
        return sum + item.priceCents * entry.quantity;
    }, 0);

    cartTotal.textContent = formatCurrency(totalCents / 100);

    cartContainer.innerHTML = "";

    cart.forEach((entry) => {
        const item = items.find((i) => entry.id === i.id);
        const cartItem = cartItemTemplate.content.cloneNode(true);

        const container = cartItem.querySelector("[data-cart-item]");
        container.dataset.id = item.id;

        const name = cartItem.querySelector("[data-cart-item-name]");
        name.textContent = item.name;

        const image = cartItem.querySelector("[data-cart-item-img]");
        image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

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
// add items to cart
//click event for adding
//multiple same item
//calculate total
