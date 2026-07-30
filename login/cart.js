const cart = JSON.parse(localStorage.getItem("cart")) || {};
const products = JSON.parse(localStorage.getItem("products")) || []; // Optional: Save products list during shop.js

const orderItemsDiv = document.getElementById("order-items");
const subtotalSpan = document.getElementById("subtotal");
const summarySubtotal = document.getElementById("summary-subtotal");
const taxSpan = document.getElementById("tax");
const totalSpan = document.getElementById("total");

// Simulate fetch (in actual case, you'd store product list in localStorage or DB)
function getProductById(id) {
  return products.find(p => p.id == id);
}

function renderCart() {
  let subtotal = 0;
  orderItemsDiv.innerHTML = "";

  for (let id in cart) {
    const product = getProductById(id);
    const quantity = cart[id];

    if (!product) continue;

    const price = product.price * quantity;
    subtotal += price;

    const item = document.createElement("div");
    item.innerHTML = `<p>${product.name} × ${quantity} = ₹${price}</p>`;
    orderItemsDiv.appendChild(item);
  }

  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + tax;

  subtotalSpan.textContent = subtotal;
  if (summarySubtotal) summarySubtotal.textContent = subtotal;
  if (taxSpan) taxSpan.textContent = tax;
  if (totalSpan) totalSpan.textContent = total;
}

renderCart();

// Submit order
document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const orderDetails = {
    items: cart,
    customer: Object.fromEntries(formData.entries())
  };

  fetch("save_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderDetails)
  })
  .then(res => res.text())
  .then(data => {
    alert("Order Placed Successfully!");
    localStorage.removeItem("cart");
    window.location.href = "shop.html";
  })
  .catch(err => {
    console.error(err);
    alert("Failed to place order");
  });
});
