<?php
session_start();
header('Content-Type: application/json');
include 'db_connection.php'; // Uses the mysqli connection $conn

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve form data
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $city = $_POST['city'] ?? '';
    $state = $_POST['state'] ?? '';
    $zip = $_POST['zip'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $cart = $_SESSION['cart'] ?? [];

    // Validate form and cart
    if (empty($full_name) || empty($email) || empty($address) || empty($city) || empty($state) || empty($zip) || empty($phone)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill all the required fields.']);
        exit;
    }

    if (empty($cart)) {
        echo json_encode(['status' => 'error', 'message' => 'Cart is empty.']);
        exit;
    }

    // Calculate total price
    $total = 0;
    foreach ($cart as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    // Get logged-in user ID if available
    $user_id = $_SESSION['user_id'] ?? null;

    // Insert into orders table
    $stmt = $conn->prepare("INSERT INTO orders (user_id, full_name, email, address, city, state, zip_code, phone, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("isssssssd", $user_id, $full_name, $email, $address, $city, $state, $zip, $phone, $total);
    $stmt->execute();
    $order_id = $stmt->insert_id;
    $stmt->close();

    // Insert each item into order_items table
    $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Item prepare failed: ' . $conn->error]);
        exit;
    }

    foreach ($cart as $item) {
        $stmt->bind_param("iiid", $order_id, $item['id'], $item['quantity'], $item['price']);
        $stmt->execute();
    }
    $stmt->close();

    // Clear the cart after successful order
    unset($_SESSION['cart']);

    echo json_encode(['status' => 'success', 'message' => 'Order placed successfully!', 'order_id' => $order_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
