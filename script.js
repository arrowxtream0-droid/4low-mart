
const cart = [];

const cartCount = document.querySelector(".nav a:last-child");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

const products = [
  {
    name: "Wireless Headphones",
    price: 1499,
    icon: "🎧"
  },
  {
    name: "Smart Watch",
    price: 1999,
    icon: "⌚"
  },
  {
    name: "Sports Shoes",
    price: 2499,
    icon: "👟"
  },
  {
    name: "Everyday Backpack",
    price: 999,
    icon: "🎒"
  }
];

// Add cart buttons to product cards
document.querySelectorAll(".product-card").forEach((card, index) => {
  const product = products[index];

  if (!product) return;

  const price = document.createElement("p");
  price.textContent = "₹" + product.price.toLocaleString("en-IN");

  const button = document.createElement("button");
  button.textContent = "Add to Cart";
  button.className = "add-cart-button";

  button.addEventListener("click", () => {
    const existing = cart.find(item => item.name === product.name);

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

// Update cart count
function updateCart() {
  const total = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cartCount.textContent = `Cart (${total})`;
}

// Search products
function searchProducts() {
  const query = searchInput.value.toLowerCase().trim();

  document.querySelectorAll(".product-card").forEach(card => {
    const name = card.querySelector("h3").textContent.toLowerCase();

    card.style.display = name.includes(query) ? "" : "none";
  });
}

searchButton.addEventListener("click", searchProducts);

searchInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    searchProducts();
  }
});

