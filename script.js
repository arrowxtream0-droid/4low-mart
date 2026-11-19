
// 4LOW-MART - Main JavaScript

// Search functionality
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

function searchProducts() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const products = document.querySelectorAll('.product-card');

  if (!searchValue) {
    alert('Please enter a product name.');
    return;
  }

  let found = 0;

  products.forEach(product => {
    const productName = product.querySelector('h3').textContent.toLowerCase();

    if (productName.includes(searchValue)) {
      product.style.display = 'block';
      found++;
    } else {
      product.style.display = 'none';
    }
  });

  document.querySelector('#products').scrollIntoView({
    behavior: 'smooth'
  });

  if (found === 0) {
    alert('No matching products found. Try another search.');
  }
}

searchButton.addEventListener('click', searchProducts);

searchInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchProducts();
  }
});

// 4LOW-MART welcome message
console.log('Welcome to 4LOW-MART Marketplace!');
