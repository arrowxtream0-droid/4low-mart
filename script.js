
const cart = [];

const cartCount = document.querySelector(".nav a:last-child");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

const products = [
  { name: "Wireless Headphones", price: 1499, icon: "🎧" },
  { name: "Smart Watch", price: 1999, icon: "⌚" },
  { name: "Sports Shoes", price: 2499, icon: "👟" },
  { name: "Everyday Backpack", price: 999, icon: "🎒" }
];

const cards = document.querySelectorAll(".product-card");

// Add prices and cart buttons
cards.forEach((card, index) => {
  const product = products[index];
  if (!product) return;

  const price = document.createElement("p");
  price.textContent = "₹" + product.price.toLocaleString("en-IN");

  const button = document.createElement("button");
  button.textContent = "Add to Cart";
  button.className = "add-cart-button";

  button.addEventListener("click", () => {
    const existing = cart.find(
      item => item.name === product.name
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    button.textContent = "Added ✓";

    setTimeout(() => {
      button.textContent = "Add to Cart";
    }, 1000);
  });

  card.appendChild(price);
  card.appendChild(button);
});

// Update cart quantity
function updateCart() {
  const total = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  if (cartCount) {
    cartCount.textContent = `Cart (${total})`;
  }
}

// Search products
function searchProducts() {
  const query = searchInput.value.trim().toLowerCase();

  cards.forEach(card => {
    const name = card.querySelector("h3")
      .textContent.toLowerCase();

    card.style.display = name.includes(query) ? "" : "none";
  });
}

// Search while typing
if (searchInput) {
  searchInput.addEventListener("input", searchProducts);

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchProducts();
    }
  });
}

// Search button
if (searchButton) {
  searchButton.addEventListener("click", event => {
    event.preventDefault();
    searchProducts();
  });
      }
