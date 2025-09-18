// Get orders from localStorage
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// Save orders
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

// Delete a specific order by ID
function deleteOrder(orderId) {
  let orders = getOrders();
  orders = orders.filter(o => o.id !== orderId);
  saveOrders(orders);
  location.reload(); // refresh table
}

// Clear all orders
function clearOrders() {
  localStorage.removeItem("orders");
  location.reload();
}

// Handle "Order Now" buttons (main.html)
document.querySelectorAll(".order-btn").forEach(button => {
  button.addEventListener("click", () => {
    const item = button.getAttribute("data-item");
    const price = parseFloat(button.getAttribute("data-price"));

    let orders = getOrders();

    let existing = orders.find(o => o.item === item);
    if (existing) {
      existing.quantity += 1;
    } else {
      orders.push({
        id: Date.now(),
        item,
        price,
        quantity: 1,
        status: "Pending"
      });
    }

    saveOrders(orders);
    alert(`${item} added to your orders!`);
  });
});

// Display orders on order.html
if (document.getElementById("orderList")) {
  let orders = getOrders();
  let orderList = document.getElementById("orderList");

  if (orders.length === 0) {
    orderList.innerHTML = `<tr><td colspan="6">No orders yet.</td></tr>`;
  } else {
    orders.forEach(order => {
      orderList.innerHTML += `
        <tr>
          <td>#${order.id}</td>
          <td>${order.item}</td>
          <td>₱${order.price}</td>
          <td>${order.quantity}</td>
          <td><span class="status pending">${order.status}</span></td>
          <td><button class="btn delete-btn" data-id="${order.id}">Delete</button></td>
        </tr>
      `;
    });

    // Add delete button listeners
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id"));
        deleteOrder(id);
      });
    });

    // Handle "Clear All Orders"
    document.getElementById("clearOrders").addEventListener("click", clearOrders);
  }
}
