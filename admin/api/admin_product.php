<?php
// admin_product.php

// Database connection
$servername = "localhost";
$username = "root"; // default XAMPP username
$password = "";     // default XAMPP password
$dbname = "shopdb"; // your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $image = $_POST['image'];

    // Insert into database
    $sql = "INSERT INTO products (name, price, stock, image) 
            VALUES ('$name', '$price', '$stock', '$image')";

    if ($conn->query($sql) === TRUE) {
        echo "Product added successfully!";
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();
?>
