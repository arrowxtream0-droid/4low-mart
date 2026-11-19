
document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");
  const cartCount = document.querySelector(".nav a:last-child");
  const cards = document.querySelectorAll(".product-card");

  const products = [
    { name: "Wireless Headphones", price: 1499 },
    { name: "Smart Watch", price: 1999 },
    { name: "Sports Shoes", price: 2499 },
    { name: "Everyday Backpack", price: 999 }
  ];

  // Add prices and cart buttons
  cards.forEach((card, index) => {
    const product = products[index];
    if (!product) return;

    if (!card.querySelector(".product-price")) {
      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent = "₹" + product.price.toLocaleString("en-IN");
      card.appendChild(price);
    }

    if (!card.querySelector(".add-cart-button")) {
      const button = document.createElement("button");
      button.className = "add-cart-button";
      button.textContent = "Add to Cart";

      button.addEventListener("click", () => {
        const existing = cart.find(item => item.name === product.name);

        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        const total = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (cartCount) {
          cartCount.textContent = `Cart (${total})`;
        }

        button.textContent = "Added ✓";
      });

      card.appendChild(button);
    }
  });

  // Search products
  function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    cards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(query) ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchProducts);
    searchInput.addEventListener("keyup", searchProducts);
  }

  if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
  }
});
