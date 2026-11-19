
document.addEventListener("DOMContentLoaded", () => {
  const cart = [];

  const cards = document.querySelectorAll(".product-card");
  const searchInput = document.querySelector(".search-box input");
  const searchButton = document.querySelector(".search-box button");

  const cartToggle = document.querySelector("#cart-toggle");
  const cartDrawer = document.querySelector("#cart-drawer");
  const cartOverlay = document.querySelector("#cart-overlay");
  const cartClose = document.querySelector("#cart-close");
  const cartItems = document.querySelector("#cart-items");
  const cartCount = document.querySelector(".nav a:last-child");
  const cartTotal = document.querySelector("#cart-total");
  const continueShopping = document.querySelector("#continue-shopping");
  const checkoutButton = document.querySelector("#checkout-button");

  const products = [
    { name: "Wireless Headphones", price: 1499 },
    { name: "Smart Watch", price: 1999 },
    { name: "Sports Shoes", price: 2499 },
    { name: "Everyday Backpack", price: 999 }
  ];

  // Add product prices and buttons
  cards.forEach((card, index) => {
    const product = products[index];
    if (!product) return;

    const image = card.querySelector(".product-image");
    product.icon = image ? image.textContent.trim() : "🛍️";

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
        addToCart(product);
        button.textContent = "Added ✓";

        setTimeout(() => {
          button.textContent = "Add to Cart";
        }, 1000);
      });

      card.appendChild(button);
    }
  });

  // Add product to cart
  function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  // Render cart contents
  function renderCart() {
    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    if (cartCount) {
      cartCount.textContent = `Cart (${totalQuantity})`;
    }

    cartItems.replaceChildren();

    if (cart.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-cart";
      empty.textContent = "Your cart is empty.";
      cartItems.appendChild(empty);
    }

    cart.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-product";

      const icon = document.createElement("div");
      icon.className = "cart-product-icon";
      icon.textContent = item.icon;

      const details = document.createElement("div");
      details.className = "cart-product-details";

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.textContent = "₹" + item.price.toLocaleString("en-IN");

      const controls = document.createElement("div");
      controls.className = "cart-quantity";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.addEventListener("click", () => changeQuantity(item.name, -1));

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.addEventListener("click", () => changeQuantity(item.name, 1));

      const remove = document.createElement("button");
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeItem(item.name));

      controls.append(minus, quantity, plus);
      details.append(name, price, controls, remove);
      row.append(icon, details);
      cartItems.appendChild(row);
    });

    cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");
  }

  // Change quantity
  function changeQuantity(name, amount) {
    const item = cart.find(product => product.name === name);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      removeItem(name);
      return;
    }

    renderCart();
  }

  // Remove item
  function removeItem(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
      cart.splice(index, 1);
    }

    renderCart();
  }

  // Open cart
  function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  }

  // Close cart
  function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
  }

  if (cartToggle) {
    cartToggle.addEventListener("click", event => {
      event.preventDefault();
      openCart();
    });
  }

  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (continueShopping) {
    continueShopping.addEventListener("click", closeCart);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  // Product search
  function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    cards.forEach(card => {
      const name = card.querySelector("h3").textContent.toLowerCase();
      card.style.display = name.includes(query) ? "" : "none";
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", searchProducts);
    searchInput.addEventListener("keydown", event => {
      if (event.key === "Enter") searchProducts();
    });
  }

  if (searchButton) {
    searchButton.addEventListener("click", searchProducts);
  }

  // Checkout is not connected to a payment system yet
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Checkout will be available when we connect our order and payment system.");
      }
    });
  }

  renderCart();
});
                  
