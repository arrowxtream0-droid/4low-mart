
import { auth, db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

  // 1. PAGE ELEMENTS

  const productGrid = document.querySelector(".product-grid");
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

  const quickViewModal = document.querySelector("#quick-view-modal");
  const quickViewDetails = document.querySelector("#quick-view-details");
  const quickViewClose = document.querySelector("#quick-view-close");

  // 2. CART DATA

  let cart = [];

  try {
    const savedCart = localStorage.getItem("4lowMartCart");

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        cart = parsedCart.filter(item =>
          item &&
          item.id !== undefined &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price)) &&
          Number.isFinite(Number(item.quantity)) &&
          Number(item.quantity) > 0
        ).map(item => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity)
        }));
      }
    }
  } catch (error) {
    console.error("Cart loading error:", error);
    cart = [];
  }

  let products = [];

  // 3. LOAD PRODUCTS FROM FIRESTORE

  async function loadProducts() {

    if (productGrid) {
      productGrid.innerHTML =
        "<p class='product-loading'>Loading products...</p>";
    }

    try {
      const productsQuery = query(
        collection(db, "products"),
        where("active", "==", true)
      );

      const snapshot = await getDocs(productsQuery);
alert("Firebase connected. Documents found: " + snapshot.size);
      products = snapshot.docs.map(document => {
        const data = document.data();

        return {
          id: document.id,
          name: data.name || "Unnamed Product",
          price: Number(data.price) || 0,
          originalPrice: Number(
            data.original_price ?? data.price
          ) || 0,
          rating: Number(data.rating) || 0,
          discount: data.discount || "",
          image: data.image || "",
          active: data.active
        };
      }).filter(product =>
        product.name &&
        product.price > 0
      );

      renderProducts();

    } catch (error) {
      console.error("Firebase product loading error:", error);

      if (productGrid) {
        productGrid.innerHTML =
          "<p>Unable to load products. Please check your connection and refresh.</p>";
      }
    }
  }

  // 4. RENDER PRODUCTS

  function renderProducts() {

    if (!productGrid) return;

    productGrid.replaceChildren();

    if (products.length === 0) {
      const message = document.createElement("p");
      message.textContent = "No products available right now.";
      productGrid.appendChild(message);
      return;
    }

    products.forEach(product => {

      const card = document.createElement("div");
      card.className = "product-card";

      const imageBox = document.createElement("div");
      imageBox.className = "product-image";

      if (product.image) {
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";
        imageBox.appendChild(image);
      }

      if (product.discount) {
        const discount = document.createElement("span");
        discount.className = "product-discount";
        discount.textContent = product.discount;
        imageBox.appendChild(discount);
      }

      const heading = document.createElement("h3");
      heading.textContent = product.name;

      const rating = document.createElement("p");
      rating.className = "product-rating";
      rating.textContent = "★ " + product.rating + " / 5";

      const priceBox = document.createElement("div");
      priceBox.className = "product-price-box";

      const price = document.createElement("p");
      price.className = "product-price";
      price.textContent =
        "₹" + product.price.toLocaleString("en-IN");

      const originalPrice = document.createElement("span");
      originalPrice.className = "product-original-price";
      originalPrice.textContent =
        "₹" + product.originalPrice.toLocaleString("en-IN");

      priceBox.append(price, originalPrice);

      const quickButton = document.createElement("button");
      quickButton.className = "quick-view-button";
      quickButton.textContent = "Quick View";

      quickButton.addEventListener("click", () => {
        openQuickView(product);
      });

      const addButton = document.createElement("button");
      addButton.className = "add-cart-button";
      addButton.textContent = "Add to Cart";

      addButton.addEventListener("click", () => {
        addToCart(product);

        addButton.textContent = "Added ✓";
        addButton.disabled = true;

        setTimeout(() => {
          addButton.textContent = "Add to Cart";
          addButton.disabled = false;
        }, 1000);
      });

      card.append(
        imageBox,
        heading,
        rating,
        priceBox,
        quickButton,
        addButton
      );

      productGrid.appendChild(card);
    });

    searchProducts();
  }

  // 5. QUICK VIEW

  function openQuickView(product) {

    if (!quickViewModal || !quickViewDetails) return;

    quickViewDetails.replaceChildren();

    if (product.image) {
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      quickViewDetails.appendChild(image);
    }

    const heading = document.createElement("h2");
    heading.textContent = product.name;

    const rating = document.createElement("p");
    rating.textContent = "★ " + product.rating + " / 5";

    const price = document.createElement("p");
    price.className = "quick-view-price";
    price.textContent =
      "₹" + product.price.toLocaleString("en-IN");

    const originalPrice = document.createElement("p");
    const del = document.createElement("del");

    del.textContent =
      "₹" + product.originalPrice.toLocaleString("en-IN");

    originalPrice.appendChild(del);

    const discount = document.createElement("p");
    discount.textContent = product.discount;

    const quantityBox = document.createElement("div");
    quantityBox.className = "quick-view-quantity";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";

    const quantityDisplay = document.createElement("span");
    quantityDisplay.textContent = "1";

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";

    quantityBox.append(minus, quantityDisplay, plus);

    let selectedQuantity = 1;

    minus.addEventListener("click", () => {
      if (selectedQuantity > 1) {
        selectedQuantity--;
        quantityDisplay.textContent = selectedQuantity;
      }
    });

    plus.addEventListener("click", () => {
      selectedQuantity++;
      quantityDisplay.textContent = selectedQuantity;
    });

    const addButton = document.createElement("button");
    addButton.className = "add-cart-button";
    addButton.textContent = "Add to Cart";

    addButton.addEventListener("click", () => {
      addToCart(product, selectedQuantity);
      closeQuickView();
    });

    quickViewDetails.append(
      heading,
      rating,
      price,
      originalPrice,
      discount,
      quantityBox,
      addButton
    );

    quickViewModal.classList.add("active");
  }

  function closeQuickView() {
    if (quickViewModal) {
      quickViewModal.classList.remove("active");
    }
  }

  if (quickViewClose) {
    quickViewClose.addEventListener("click", closeQuickView);
  }

  if (quickViewModal) {
    quickViewModal.addEventListener("click", event => {
      if (event.target === quickViewModal) {
        closeQuickView();
      }
    });
  }

  // 6. SAVE CART

  function saveCart() {
    try {
      localStorage.setItem(
        "4lowMartCart",
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Cart saving error:", error);
    }
  }

  // 7. ADD TO CART

  function addToCart(product, quantity = 1) {

    const existing = cart.find(item =>
      String(item.id) === String(product.id)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        ...product,
        quantity
      });
    }

    renderCart();
  }

  // 8. RENDER CART

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

      if (item.image) {
        const image = document.createElement("img");
        image.className = "cart-product-icon";
        image.src = item.image;
        image.alt = item.name;
        image.style.width = "85px";
        image.style.height = "85px";
        image.style.objectFit = "contain";
        image.style.borderRadius = "8px";
        image.style.background = "#222";
        row.appendChild(image);
      }

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
        changeQuantity(item.id, -1);
      });

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.addEventListener("click", () => {
        changeQuantity(item.id, 1);
      });

      const remove = document.createElement("button");
      remove.className = "cart-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => {
        removeItem(item.id);
      });

      controls.append(minus, quantity, plus);
      details.append(name, price, controls, remove);
      row.appendChild(details);
      cartItems.appendChild(row);
    });

    saveCart();
  }

  // 9. CHANGE QUANTITY

  function changeQuantity(id, amount) {

    const item = cart.find(product =>
      String(product.id) === String(id)
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
      removeItem(id);
      return;
    }

    renderCart();
  }

  // 10. REMOVE PRODUCT

  function removeItem(id) {

    cart = cart.filter(item =>
      String(item.id) !== String(id)
    );

    renderCart();
  }

  // 11. CART OPEN AND CLOSE

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

  // 12. SEARCH PRODUCTS

  function searchProducts() {

    if (!searchInput || !productGrid) return;

    const query = searchInput.value.trim().toLowerCase();

    productGrid.querySelectorAll(".product-card").forEach(card => {

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

  // 13. CHECKOUT

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {

      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      if (!auth.currentUser) {
        alert("Please create an account or log in before checkout. Account setup is coming next.");
        return;
      }

      window.location.href = "checkout.html";
    });
  }

  // 14. KEYBOARD CONTROLS

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeCart();
      closeQuickView();
    }
  });

  // 15. INITIALIZE

  renderCart();
  await loadProducts();

});
      
