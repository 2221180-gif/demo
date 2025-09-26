<?php
$host = "localhost";
$db   = "shopdb";     // your DB name
$user = "root";       // XAMPP default
$pass = "";           // XAMPP default password empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "DB Connection failed: " . $e->getMessage()]));
}
?>
