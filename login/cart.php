<?php
session_start();
include 'db_connection.php';

// Fetch user data if logged in
$user_id = $_SESSION['user_id'] ?? null;
$user = [
    'full_name' => '',
    'email' => '',
    'address' => '',
    'city' => '',
    'state' => '',
    'zip_code' => '',
    'phone' => ''
];

if ($user_id) {
    $stmt = $conn->prepare("SELECT full_name, email, address, city, state, zip_code, phone FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($user['full_name'], $user['email'], $user['address'], $user['city'], $user['state'], $user['zip_code'], $user['phone']);
    $stmt->fetch();
    $stmt->close();
}

// Fetch cart from session
$cart = $_SESSION['cart'] ?? [];
?>

<!DOCTYPE html>
<html>
<head>
    <title>LuxeWear | Cart</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; }
        h2 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 10px; border: 1px solid #ccc; text-align: center; }
        form input, form button { padding: 10px; margin: 5px 0; width: 100%; }
        form { max-width: 400px; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px #ccc; }
        .total { font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>

<h2>Your Shopping Cart</h2>

<?php if (empty($cart)): ?>
    <p>Your cart is empty. <a href="shop.php">Continue Shopping</a></p>
<?php else: ?>
    <table>
        <tr>
            <th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th>
        </tr>
        <?php
        $total = 0;
        foreach ($cart as $item):
            $subtotal = $item['price'] * $item['quantity'];
            $total += $subtotal;
        ?>
        <tr>
            <td><?= htmlspecialchars($item['name']) ?></td>
            <td>₹<?= number_format($item['price'], 2) ?></td>
            <td><?= $item['quantity'] ?></td>
            <td>₹<?= number_format($subtotal, 2) ?></td>
        </tr>
        <?php endforeach; ?>
        <tr>
            <td colspan="3" class="total">Total</td>
            <td class="total">₹<?= number_format($total, 2) ?></td>
        </tr>
    </table>

    <h3>Checkout</h3>
    <form method="post" action="save_order.php">
        <input type="text" name="full_name" placeholder="Full Name" value="<?= htmlspecialchars($user['full_name']) ?>" required>
        <input type="email" name="email" placeholder="Email" value="<?= htmlspecialchars($user['email']) ?>" required>
        <input type="text" name="address" placeholder="Address" value="<?= htmlspecialchars($user['address']) ?>" required>
        <input type="text" name="city" placeholder="City" value="<?= htmlspecialchars($user['city']) ?>" required>
        <input type="text" name="state" placeholder="State" value="<?= htmlspecialchars($user['state']) ?>" required>
        <input type="text" name="zip" placeholder="Zip Code" value="<?= htmlspecialchars($user['zip_code']) ?>" required>
        <input type="text" name="phone" placeholder="Phone Number" value="<?= htmlspecialchars($user['phone']) ?>" required>
        <button type="submit">Place Order</button>
    </form>
<?php endif; ?>

</body>
</html>
