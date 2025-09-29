<?php
class Order {
    public static function create($conn, $customer_name, $customer_email, $customer_phone, $product_id, $quantity, $total_price) {
        $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_email, customer_phone, product_id, quantity, total_price) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssidd", $customer_name, $customer_email, $customer_phone, $product_id, $quantity, $total_price);
        return $stmt->execute();
    }

    public static function all($conn) {
        $result = $conn->query("SELECT * FROM orders ORDER BY order_date DESC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>
