
document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 1. CART DATA
  // =========================

  let cart = [];

  try {
    const savedCart = localStorage.getItem("4lowMartCart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) cart = parsedCart;
    }
  } catch (error) {
    localStorage.removeItem("4lowMartCart");
  }

  // =========================
  // 2. PAGE ELEMENTS
  // =========================

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

  // =========================
  // 3. PRODUCT DATA
  // =========================

  const products = [
    {
      name: "Wireless Headphones",
      price: 1499,
      originalPrice: 2499,
      rating: 4.5,
      discount: "40% OFF",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Smart Watch",
      price: 1999,
      originalPrice: 2999,
      rating: 4.3,
      discount: "33% OFF",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Sports Shoes",
      price: 2499,
      originalPrice: 3499,
      rating: 4.6,
      discount: "29% OFF",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    },
    {
      name: "Everyday Backpack",
      price: 999,
      originalPrice: 1499,
      rating: 4.2,
      discount: "33% OFF",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80"
    }
  ];

  // =========================
  // 4. PRODUCT CARD DESIGN
  // =========================

  cards.forEach((card, index) => {
    const product = products[index];
    if (!product) return;

    const imageBox = card.querySelector(".product-image");

    if (imageBox) {
      const img = document.createElement("img");

      img.src = product.image;
      img.alt = product.name;
      img.loading = "lazy";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";

      imageBox.replaceChildren(img);

      const discount = document.createElement("span");
      discount.className = "product-discount";
      discount.textContent = product.discount;

      imageBox.appendChild(discount);
    }

    // Product rating
    const rating = document.createElement("p");
    rating.className = "product-rating";
    rating.textContent = `★ ${product.rating} / 5`;

    // Original price
    const originalPrice = document.createElement("span");
    originalPrice.className = "product-original-price";
    originalPrice.textContent =
      "₹" + product.originalPrice.toLocaleString("en-IN");

    // Current price
    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent =
      "₹" + product.price.toLocaleString("en-IN");

    // Price section
    const priceBox = document.createElement("div");
    priceBox.className = "product-price-box";
    priceBox.append(price, originalPrice);

    // Add product information
    card.append(rating, priceBox);

    
    
    // QUICK VIEW BUTTON
    const quickViewButton = document.createElement("button");
    quickViewButton.className = "quick-view-button";
    quickViewButton.textContent = "Quick View";

    quickViewButton.addEventListener("click", () => {
      const modal = document.querySelector("#quick-view-modal");
      const details = document.querySelector("#quick-view-details");

      if (!modal || !details) return;

      details.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>★ ${product.rating} / 5</p>
        <p class="quick-view-price">
          ₹${product.price.toLocaleString("en-IN")}
        </p>
        <p><del>₹${product.originalPrice.toLocaleString("en-IN")}</del></p>
        <p>${product.discount}</p>
        <button class="add-cart-button" id="quick-view-add-cart">
          Add to Cart
        </button>
      `;

      modal.classList.add("active");

      document.querySelector("#quick-view-add-cart")
        .addEventListener("click", () => {
          addToCart(product);
          modal.classList.remove("active");
        });
    });

    card.appendChild(quickViewButton);
    
  

    // ADD TO CART BUTTON
    const button = document.createElement("button");
    button.className = "add-cart-button";
    button.textContent = "Add to Cart";

    button.addEventListener("click", () => {
      addToCart(product);

      button.textContent = "Added ✓";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = "Add to Cart";
        button.disabled = false;
      }, 1000);
    });

    card.appendChild(button);
  });
  

  // =========================
  // 5. SAVE CART
  // =========================

  function saveCart() {
    localStorage.setItem("4lowMartCart", JSON.stringify(cart));
  }

  // =========================
  // 6. ADD TO CART
  // =========================

  function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  // =========================
  // 7. RENDER CART
  // =========================

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

    if (cartTotal) {
      cartTotal.textContent =
        "₹" + totalPrice.toLocaleString("en-IN");
    }

    if (!cartItems) {
      saveCart();
      return;
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

      const img = document.createElement("img");
      img.className = "cart-product-icon";
      img.src = item.image || "";
      img.alt = item.name;
      img.style.width = "85px";
      img.style.height = "85px";
      img.style.objectFit = "contain";
      img.style.borderRadius = "8px";
      img.style.background = "#222";

      const details = document.createElement("div");
      details.className = "cart-product-details";

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.textContent =
        "₹" + item.price.toLocaleString("en-IN");

      const controls = document.createElement("div");
      controls.className = "cart-quantity";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.addEventListener("click", () => {
        changeQuantity(item.name, -1);
      });

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.addEventListener("click", () => {
        changeQuantity(item.name, 1);
      });

      const remove = document.createElement("button");
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        removeItem(item.name);
      });

      controls.append(minus, quantity, plus);
      details.append(name, price, controls, remove);
      row.append(img, details);
      cartItems.appendChild(row);
    });

    saveCart();
  }

  // =========================
  // 8. CHANGE QUANTITY
  // =========================

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

  // =========================
  // 9. REMOVE PRODUCT
  // =========================

  function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    renderCart();
  }

  // =========================
  // 10. OPEN AND CLOSE CART
  // =========================

  function openCart() {
    if (!cartDrawer || !cartOverlay) return;

    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
  }

  if (cartToggle) {
    cartToggle.addEventListener("click", event => {
      event.preventDefault();
      openCart();
    });
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  if (continueShopping) {
    continueShopping.addEventListener("click", closeCart);
  }

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  // =========================
  // 11. SEARCH PRODUCTS
  // =========================

  function searchProducts() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    cards.forEach(card => {
      const heading = card.querySelector("h3");
      const name = heading
        ? heading.textContent.toLowerCase()
        : "";

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

  // =========================
  // 12. CHECKOUT
  // =========================

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }

  // =========================
  // 13. INITIAL CART DISPLAY
  // =========================

  renderCart();

});
                     
