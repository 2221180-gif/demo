<?php
require_once("../config/db.php");
require_once("../models/Order.php");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $customer_name  = $_POST['customer_name'];
    $customer_email = $_POST['customer_email'];
    $customer_phone = $_POST['customer_phone'];
    $product_id     = (int)$_POST['product_id'];
    $quantity       = (int)$_POST['quantity'];
    $total_price    = (float)$_POST['total_price'];

    if (Order::create($conn, $customer_name, $customer_email, $customer_phone, $product_id, $quantity, $total_price)) {
        header("Location: ../order-sucess.html");
        exit;
    } else {
        echo "❌ Failed to save order.";
    }
}
?>
