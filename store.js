import items from "./items.json";
import formatCurrency from "./formatCurrency";
import { addToCart } from "./cart.js";

const storeItemTemplate = document.querySelector("#store-item-template");
const storeItemContainer = document.querySelector("[data-store-container]");
const IMAGE_URL = "https://dummyimage.com/420x260";

// Basically a container for store, this'll help invoking store items
export function renderStore() {
    if (storeItemContainer == null) return; //failsafe for not trying to load the store on other pages

    //Global event listener for add-to-cart buttons
    document.addEventListener("click", (e) => {
        if (e.target.matches("[data-add-to-cart-button]")) {
            const itemId = e.target.closest("[data-store-item-id]").dataset.id;
            addToCart(parseInt(itemId));
        }
    });

    // Fetch DB and run renderStoreItem for each obj item
    items.forEach(renderStoreItem);
}

// For rendering each store item
function renderStoreItem(item) {
    const storeItem = storeItemTemplate.content.cloneNode(true);

    const container = storeItem.querySelector("[data-store-item-id]");
    container.dataset.id = item.id;

    const category = storeItem.querySelector("[data-store-item-category]");
    category.textContent = item.category;

    const name = storeItem.querySelector("[data-store-item-name]");
    name.textContent = item.name;

    const image = storeItem.querySelector("[data-store-item-img]");
    image.src = `${IMAGE_URL}/${item.imageColor}/${item.imageColor}`;

    const price = storeItem.querySelector("[data-store-item-price]");
    price.textContent = formatCurrency(item.priceCents / 100);

    storeItemContainer.appendChild(storeItem);
}
