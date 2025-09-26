<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Check if admin is logged in
if(!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized"));
    exit();
}

$base_path = dirname(dirname(dirname(__FILE__)));
include_once $base_path . '/backend/config/database.php';
include_once $base_path . '/backend/models/Product.php';

$database = new Database();
$db = $database->getConnection();
$product = new Product($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $stmt = $product->read();
        $products = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }
        
        echo json_encode($products);
        break;
        
    case 'POST':
        // Add new product
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->price)) {
            $query = "INSERT INTO products (name, description, price, image_url, stock) 
                     VALUES (:name, :description, :price, :image_url, :stock)";
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(':name', $data->name);
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':price', $data->price);
            $stmt->bindParam(':image_url', $data->image_url);
            $stmt->bindParam(':stock', $data->stock);
            
            if($stmt->execute()) {
                echo json_encode(array("message" => "Product added successfully"));
            } else {
                echo json_encode(array("message" => "Unable to add product"));
            }
        }
        break;
}
?>