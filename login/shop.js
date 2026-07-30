const products = [
  // MEN
  { id: 1, name: "Men's White Shirt", price: 499, image: "https://i.imgur.com/TVgeA1S.jpg", category: "men", size: "M", color: "white" },
  { id: 2, name: "Men's Black Hoodie", price: 799, image: "https://i.imgur.com/K7YjP3A.jpg", category: "men", size: "L", color: "black" },
  { id: 3, name: "Men's Blue Denim Jacket", price: 1199, image: "https://i.imgur.com/O59t0TW.jpg", category: "men", size: "L", color: "blue" },

  // WOMEN
  { id: 4, name: "Women's Red Dress", price: 899, image: "https://i.imgur.com/qDIDRfC.jpg", category: "women", size: "S", color: "red" },
  { id: 5, name: "Women's Floral Kurti", price: 749, image: "https://i.imgur.com/1SK84Bi.jpg", category: "women", size: "M", color: "green" },
  { id: 6, name: "Women's White Top", price: 499, image: "https://i.imgur.com/ZdvxU5y.jpg", category: "women", size: "L", color: "white" },

  // KIDS
  { id: 7, name: "Kids Blue Frock", price: 599, image: "https://i.imgur.com/NK8XUwZ.jpg", category: "kids", size: "S", color: "blue" },
  { id: 8, name: "Kids Green T-Shirt", price: 399, image: "https://i.imgur.com/0r9USu9.jpg", category: "kids", size: "M", color: "green" },
  { id: 9, name: "Kids Red Hoodie", price: 499, image: "https://i.imgur.com/ZfPZK8u.jpg", category: "kids", size: "L", color: "red" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};
const cartCount = document.getElementById("cart-count");

function renderProducts(filtered = products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  filtered.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    grid.appendChild(div);
  });
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

function updateCartCount() {
  let count = Object.values(cart).reduce((acc, val) => acc + val, 0);
  cartCount.textContent = count;
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const size = document.getElementById("sizeFilter").value;
  const color = document.getElementById("colorFilter").value;

  const filtered = products.filter(p =>
    (category === "all" || p.category === category) &&
    (size === "all" || p.size === size) &&
    (color === "all" || p.color === color)
  );
  renderProducts(filtered);
}
    function addToCart(id, name, price) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingIndex = cart.findIndex(item => item.id === id);
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }
    }

document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("sizeFilter").addEventListener("change", applyFilters);
document.getElementById("colorFilter").addEventListener("change", applyFilters);

renderProducts();
updateCartCount();
